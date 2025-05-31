
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
  try {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const fullDescription = formData.get('fullDescription') as string;
    const tagsString = formData.get('tags') as string;

    const imageFileObjects = formData.getAll('caseImages') as File[];
    const uploadedImageUrls: string[] = [];

    if (!title || !category || !description || !fullDescription) {
      return { success: false, error: 'Missing required text fields. Title, category, description, and full description are required.' };
    }

    try {
        await fs.mkdir(UPLOADS_DIR_ABSOLUTE, { recursive: true });
    } catch (mkdirError) {
        console.error('Failed to create uploads directory:', mkdirError);
        throw new Error(`Server setup error: Failed to create image upload directory. ${mkdirError instanceof Error ? mkdirError.message : String(mkdirError)}`);
    }

    let validFilesProcessed = 0;
    for (const file of imageFileObjects) {
      if (!(file instanceof File) || file.size === 0) {
        continue;
      }
      validFilesProcessed++;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const originalFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uniqueFilename = `${Date.now()}_${originalFilename}`;
      const filePath = path.join(UPLOADS_DIR_ABSOLUTE, uniqueFilename);

      await fs.writeFile(filePath, buffer);
      uploadedImageUrls.push(`/${UPLOADS_DIR_RELATIVE_TO_PUBLIC}/${uniqueFilename}`);
    }

    if (validFilesProcessed === 0 && imageFileObjects.length > 0) { // If files were selected but none were valid
         return { success: false, error: 'No valid image files were uploaded. Please select at least one non-empty image.' };
    }
    if (uploadedImageUrls.length === 0 && imageFileObjects.length > 0) { // Fallback, should be caught by above
        return { success: false, error: 'Image upload process resulted in no saved images, though files were provided.' };
    }
     // If the input was marked as required and no files are present at all (this check might be redundant if input is 'required' in form)
    if (imageFileObjects.length === 0 || imageFileObjects.every(f => f.size === 0)) { // Stricter check if file input itself was optional but submitted empty
        // This condition might need adjustment based on whether the file input is truly optional or not.
        // Assuming for now 'caseImages' is required if any files are selected/dragged.
        // If the HTML input is `required`, the browser might prevent submission, but FormData can still be empty for 'getAll'.
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
    
    console.log('addCaseAction: Successfully processed. Returning success response for case:', newCase.title);
    return { success: true, case: newCase };

  } catch (error: unknown) {
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
        try {
            const errorString = JSON.stringify(error);
            errorMessage = `Non-Error object received: ${errorString}`;
            console.error('Error (stringified):', errorString);
        } catch (stringifyError) {
            console.error('Failed to stringify unknown error:', stringifyError);
            errorMessage = 'Non-Error object received, and it could not be stringified.';
        }
    }
    console.log(`addCaseAction: Error occurred. Returning error response: ${errorMessage}`);
    return { success: false, error: `Server Action failed: ${errorMessage}` };
  }
}
