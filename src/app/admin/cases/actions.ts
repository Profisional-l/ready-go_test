
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

    // Ensure uploads directory exists
    try {
        await fs.mkdir(UPLOADS_DIR_ABSOLUTE, { recursive: true });
        console.log('addCaseAction: Uploads directory ensured/created at', UPLOADS_DIR_ABSOLUTE);
    } catch (mkdirError) {
        console.error('addCaseAction: Failed to create uploads directory:', mkdirError);
        // This specific error might be useful for debugging server setup.
        const specificErrorMessage = mkdirError instanceof Error ? mkdirError.message : String(mkdirError);
        return { success: false, error: `Server setup error: Failed to create image upload directory. ${specificErrorMessage}` };
    }

    const imageFileObjects = formData.getAll('caseImages') as File[];
    const uploadedImageUrls: string[] = [];
    let validFilesProcessed = 0;

    // Check if any files were actually provided (getAll can return empty array if input is empty)
    // The client-side 'required' on input type=file handles "no files selected".
    // This server-side check is a fallback or if 'required' is bypassed.
    if (imageFileObjects.length === 0 || imageFileObjects.every(f => !(f instanceof File) || f.size === 0)) {
        // If the input is marked as required and no valid files are present.
        // This might be redundant if client-side validation (HTML required attribute) works as expected.
        // For now, let's assume if files are required, they must be present and valid.
        // If they *can* be optional, this logic would need adjustment.
        // console.log('addCaseAction: No valid image files provided, though input might have been submitted.');
        // Potentially return error if images are strictly required:
        // return { success: false, error: 'At least one valid image file is required.' };
    }


    for (const file of imageFileObjects) {
      if (!(file instanceof File) || file.size === 0) {
        console.log(`addCaseAction: Skipped invalid or empty file: ${file.name || 'unknown file'}`);
        continue;
      }
      validFilesProcessed++;
      console.log(`addCaseAction: Processing file: ${file.name}, size: ${file.size}`);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Sanitize filename (replace potentially problematic characters)
      const originalFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uniqueFilename = `${Date.now()}_${originalFilename}`;
      const filePath = path.join(UPLOADS_DIR_ABSOLUTE, uniqueFilename);

      await fs.writeFile(filePath, buffer);
      console.log(`addCaseAction: Successfully wrote file to ${filePath}`);
      uploadedImageUrls.push(`/${UPLOADS_DIR_RELATIVE_TO_PUBLIC}/${uniqueFilename}`);
    }

    // If files were expected (based on 'required' or if some files were in the list but all invalid)
    // and none were processed successfully.
    // The client side already checks if selectedFiles is empty.
    // This check is for the case where selectedFiles is not empty, but all files in it are invalid.
    if (imageFileObjects.some(f => f instanceof File && f.size > 0) && validFilesProcessed === 0) {
        console.log('addCaseAction: Files were provided, but none were valid or could be processed.');
        return { success: false, error: 'Valid image files were selected, but an error occurred during processing. No images saved.' };
    }
    // A simpler check: if the input was supposed to have files, but we ended up with no URLs.
    // (Assuming here that if `imageFileObjects` has items, we expect `uploadedImageUrls` to also have items if processing is successful)
    // This check is somewhat covered by the one above, but can be a final safeguard.
    if (imageFileObjects.filter(f => f instanceof File && f.size > 0).length > 0 && uploadedImageUrls.length === 0) {
        console.log('addCaseAction: Image upload process resulted in no saved images, though valid files were initially present.');
        return { success: false, error: 'Image upload failed. No images were saved.' };
    }


    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    const newCase: Case = {
      id: Date.now().toString(),
      title,
      category,
      imageUrls: uploadedImageUrls, // Use the URLs of locally saved files
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
    let errorMessage = 'An unknown server error occurred.';

    if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Error Name:', error.name);
        console.error('Error Message:', errorMessage);
        console.error('Error Stack:', error.stack);
    } else {
        // Attempt to get a string representation of unknown errors
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
