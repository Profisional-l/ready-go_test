
'use server';

import type { Case } from "@/types";
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const casesFilePath = path.join(process.cwd(), 'src', 'data', 'cases.json');
const UPLOADS_DIR_RELATIVE_TO_PUBLIC = 'uploads/cases';
const UPLOADS_DIR_ABSOLUTE = path.join(process.cwd(), 'public', UPLOADS_DIR_RELATIVE_TO_PUBLIC);

async function readCasesFile(): Promise<Case[]> {
  try {
    const jsonData = await fs.readFile(casesFilePath, 'utf-8');
    return JSON.parse(jsonData) as Case[];
  } catch (error) {
    // Check if the error is ENOENT (file not found)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      // File doesn't exist, attempt to create it with an empty array
      try {
        await writeCasesFile([]);
        return [];
      } catch (writeError) {
        console.error('Error creating initial empty cases.json:', writeError);
        throw writeError; // Re-throw to be caught by the main action's handler
      }
    }
    console.error('Error reading cases.json:', error);
    throw error; // Re-throw other errors to be caught by the main action's handler
  }
}

async function writeCasesFile(cases: Case[]): Promise<void> {
  try {
    // Ensure the directory for cases.json exists
    await fs.mkdir(path.dirname(casesFilePath), { recursive: true });
    const jsonData = JSON.stringify(cases, null, 2);
    await fs.writeFile(casesFilePath, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error writing cases.json:', error);
    throw error; // Re-throw to be caught by the caller
  }
}

export async function addCaseAction(formData: FormData): Promise<{ success: boolean; case?: Case; error?: string; }> {
  try {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const fullDescription = formData.get('fullDescription') as string;
    const tagsString = formData.get('tags') as string;

    const imageFileObjects = formData.getAll('caseImages') as File[]; // Changed variable name for clarity
    const uploadedImageUrls: string[] = [];

    if (!title || !category || !description || !fullDescription) {
      return { success: false, error: 'Missing required text fields. Title, category, description, and full description are required.' };
    }

    // Ensure uploads directory exists before processing files
    try {
        await fs.mkdir(UPLOADS_DIR_ABSOLUTE, { recursive: true });
    } catch (mkdirError) {
        console.error('Failed to create uploads directory:', mkdirError);
        // This is a critical failure, so we throw to be caught by the main catch block.
        throw new Error(`Server setup error: Failed to create image upload directory. ${mkdirError instanceof Error ? mkdirError.message : String(mkdirError)}`);
    }

    for (const file of imageFileObjects) {
      if (!(file instanceof File) || file.size === 0) {
        // Skip if it's not a file object or if the file is empty
        // This handles cases where form might submit non-file entries or empty file slots.
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const originalFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uniqueFilename = `${Date.now()}_${originalFilename}`;
      const filePath = path.join(UPLOADS_DIR_ABSOLUTE, uniqueFilename);

      await fs.writeFile(filePath, buffer);
      uploadedImageUrls.push(`/${UPLOADS_DIR_RELATIVE_TO_PUBLIC}/${uniqueFilename}`);
    }

    // After processing all files, check if any valid images were actually uploaded
    if (uploadedImageUrls.length === 0) {
      return { success: false, error: 'No valid image files were uploaded. Please select at least one non-empty image.' };
    }

    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    const newCase: Case = {
      id: Date.now().toString(),
      title,
      category,
      imageUrls: uploadedImageUrls,
      description,
      fullDescription,
      tags,
    };

    const existingCases = await readCasesFile();
    const updatedCases = [...existingCases, newCase];
    await writeCasesFile(updatedCases);

    revalidatePath('/');
    revalidatePath('/admin/cases');
    
    console.log('Case added successfully (local storage):', newCase.title);
    return { success: true, case: newCase };

  } catch (error: unknown) { // Changed to unknown for stricter type checking
    console.error('<<<<< CRITICAL ERROR IN addCaseAction >>>>>');
    let errorMessage = 'An unknown server error occurred during case creation.';

    if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);
    } else if (typeof error === 'string') {
        errorMessage = error;
        console.error('Error (string):', error);
    } else {
        console.error('Error (unknown type):', error);
        // Attempt to stringify if it's an object, otherwise use a generic message
        try {
            const errorString = JSON.stringify(error);
            errorMessage = `Non-Error object received: ${errorString}`;
            console.error('Error (stringified):', errorString);
        } catch (stringifyError) {
            console.error('Failed to stringify unknown error:', stringifyError);
            errorMessage = 'Non-Error object received, and it could not be stringified.';
        }
    }
    return { success: false, error: `Server Action failed: ${errorMessage}` };
  }
}
