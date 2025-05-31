
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
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      try {
        await writeCasesFile([]);
        return [];
      } catch (writeError) {
        console.error('Error creating initial empty cases.json:', writeError);
        throw writeError; 
      }
    }
    console.error('Error reading cases.json:', error);
    throw error; 
  }
}

async function writeCasesFile(cases: Case[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(casesFilePath), { recursive: true });
    const jsonData = JSON.stringify(cases, null, 2);
    await fs.writeFile(casesFilePath, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error writing cases.json:', error);
    throw error;
  }
}

export async function addCaseAction(formData: FormData): Promise<{ success: boolean; case?: Case; error?: string; }> {
  console.log('addCaseAction: Received request.');
  try {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const fullDescription = formData.get('fullDescription') as string;
    const tagsString = formData.get('tags') as string;

    if (!title || !category || !description || !fullDescription) {
      console.log('addCaseAction: Missing required text fields.');
      return { success: false, error: 'Missing required text fields. Title, category, description, and full description are required.' };
    }

    try {
        await fs.mkdir(UPLOADS_DIR_ABSOLUTE, { recursive: true });
        console.log('addCaseAction: Uploads directory ensured/created at', UPLOADS_DIR_ABSOLUTE);
    } catch (mkdirError) {
        console.error('addCaseAction: Failed to create uploads directory:', mkdirError);
        const specificErrorMessage = mkdirError instanceof Error ? mkdirError.message : String(mkdirError);
        return { success: false, error: `Server setup error: Failed to create image upload directory. ${specificErrorMessage}` };
    }

    const imageFileObjects = formData.getAll('caseImages') as File[];
    const uploadedImageUrls: string[] = [];
    
    // Log total number of files received and their sizes
    let totalSize = 0;
    imageFileObjects.forEach(file => {
      if (file instanceof File) totalSize += file.size;
    });
    console.log(`addCaseAction: Received ${imageFileObjects.length} file objects. Total size: ${(totalSize / (1024*1024)).toFixed(2)} MB`);


    for (const file of imageFileObjects) {
      if (!(file instanceof File) || file.name === '' || file.size === 0) {
        console.log(`addCaseAction: Skipped invalid or empty file: ${file.name || 'empty File object'}`);
        continue;
      }
      
      console.log(`addCaseAction: Processing file: ${file.name}, size: ${file.size} bytes`);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const originalFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uniqueFilename = `${Date.now()}_${originalFilename}`;
      const filePath = path.join(UPLOADS_DIR_ABSOLUTE, uniqueFilename);

      await fs.writeFile(filePath, buffer);
      console.log(`addCaseAction: Successfully wrote file to ${filePath}`);
      uploadedImageUrls.push(`/${UPLOADS_DIR_RELATIVE_TO_PUBLIC}/${uniqueFilename}`);
    }

    // The file input on client-side is 'required'.
    // So, we expect at least one image to be successfully uploaded.
    if (uploadedImageUrls.length === 0) {
        console.log('addCaseAction: No images were successfully processed. At least one valid image is required.');
        return { success: false, error: 'At least one valid image is required, but none were successfully processed or saved.' };
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
    console.log('addCaseAction: cases.json updated.');

    revalidatePath('/');
    revalidatePath('/admin/cases');
    console.log('addCaseAction: Paths revalidated.');
    
    console.log('addCaseAction: Successfully processed. Returning success response for case:', newCase.title);
    return { success: true, case: newCase };

  } catch (error: unknown) {
    console.error('<<<<< CRITICAL ERROR IN addCaseAction >>>>>');
    let errorMessage = 'An unknown server error occurred during case creation.';

    if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Error Name:', error.name);
        console.error('Error Message:', errorMessage);
        console.error('Error Stack:', error.stack);
    } else {
        try {
            errorMessage = JSON.stringify(error);
        } catch {
            errorMessage = String(error);
        }
        console.error('Error (unknown type, stringified):', errorMessage);
    }
    
    console.log(`addCaseAction: Error occurred. Returning error response: ${errorMessage}`);
    return { success: false, error: `Server Action failed: ${errorMessage}` };
  }
}
