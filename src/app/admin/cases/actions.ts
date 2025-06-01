
'use server';

import type { Case } from "@/types";
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const casesFilePath = path.join(process.cwd(), 'src', 'data', 'cases.json');
const UPLOADS_DIR_RELATIVE_TO_PUBLIC = 'uploads/cases';
const UPLOADS_DIR_ABSOLUTE = path.join(process.cwd(), 'public', UPLOADS_DIR_RELATIVE_TO_PUBLIC);

async function readCasesFile(): Promise<Case[]> {
  console.log('readCasesFile: Attempting to read from', casesFilePath);
  try {
    const jsonData = await fs.readFile(casesFilePath, 'utf-8');
    console.log('readCasesFile: Successfully read cases.json.');
    return JSON.parse(jsonData) as Case[];
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      console.warn('readCasesFile: cases.json not found. Attempting to create an empty one.');
      try {
        await writeCasesFile([]); // Create an empty cases file
        console.log('readCasesFile: Created new empty cases.json.');
        return [];
      } catch (writeError) {
        console.error('readCasesFile: Error creating initial empty cases.json:', writeError);
        throw new Error(`Failed to create initial cases.json: ${writeError instanceof Error ? writeError.message : String(writeError)}`);
      }
    }
    console.error('readCasesFile: Error reading cases.json:', error);
    throw new Error(`Failed to read cases.json: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function writeCasesFile(cases: Case[]): Promise<void> {
  console.log('writeCasesFile: Attempting to write to', casesFilePath);
  try {
    // Ensure the directory for cases.json exists
    const casesDir = path.dirname(casesFilePath);
    await fs.mkdir(casesDir, { recursive: true });
    console.log('writeCasesFile: Ensured directory exists for cases.json at', casesDir);
    
    const jsonData = JSON.stringify(cases, null, 2);
    await fs.writeFile(casesFilePath, jsonData, 'utf-8');
    console.log('writeCasesFile: Successfully wrote updated data to cases.json.');
  } catch (error) {
    console.error('writeCasesFile: Error writing cases.json:', error);
    throw new Error(`Failed to write cases.json: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function addCaseAction(formData: FormData): Promise<{ success: boolean; case?: Case; error?: string; }> {
  console.log('addCaseAction: Received request.');
  try {
    const title = formData.get('title');
    const category = formData.get('category');
    const description = formData.get('description');
    const fullDescription = formData.get('fullDescription');
    const tagsString = formData.get('tags');

    if (typeof title !== 'string' || !title ||
        typeof category !== 'string' || !category ||
        typeof description !== 'string' || !description ||
        typeof fullDescription !== 'string' || !fullDescription) {
      console.log('addCaseAction: Missing or invalid required text fields.');
      return { success: false, error: 'Missing required text fields. Title, category, description, and full description are required and must be strings.' };
    }

    console.log('addCaseAction: Text fields validated.');

    try {
        await fs.mkdir(UPLOADS_DIR_ABSOLUTE, { recursive: true });
        console.log('addCaseAction: Uploads directory ensured/created at', UPLOADS_DIR_ABSOLUTE);
    } catch (mkdirError) {
        console.error('addCaseAction: Failed to create uploads directory:', mkdirError);
        const specificErrorMessage = mkdirError instanceof Error ? mkdirError.message : String(mkdirError);
        return { success: false, error: `Server setup error: Failed to create image upload directory. ${specificErrorMessage}` };
    }

    const imageFileObjects = formData.getAll('caseImages'); // Returns (File | string)[]
    const uploadedImageUrls: string[] = [];
    let totalFilesSize = 0;
    
    const validFiles = imageFileObjects.filter(file => file instanceof File && file.name && file.size > 0);
    console.log(`addCaseAction: Received ${imageFileObjects.length} file entries, ${validFiles.length} are valid File objects.`);


    for (const file of validFiles) {
      // Already filtered for File, name, and size > 0
      const currentFile = file as File; // Safe cast after filter
      console.log(`addCaseAction: Processing file: ${currentFile.name}, size: ${currentFile.size} bytes, type: ${currentFile.type}`);
      totalFilesSize += currentFile.size;

      try {
        const bytes = await currentFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const originalFilename = currentFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const uniqueFilename = `${Date.now()}_${originalFilename}`;
        const filePath = path.join(UPLOADS_DIR_ABSOLUTE, uniqueFilename);

        await fs.writeFile(filePath, buffer);
        console.log(`addCaseAction: Successfully wrote file to ${filePath}`);
        uploadedImageUrls.push(`/${UPLOADS_DIR_RELATIVE_TO_PUBLIC}/${uniqueFilename}`);
      } catch (fileProcessingError) {
        console.error(`addCaseAction: Error processing file ${currentFile.name}:`, fileProcessingError);
        // Optionally, decide if one failed file should halt the whole process or just be skipped
        // For now, we'll let one failed file not stop others, but report overall failure if no images succeed.
      }
    }
    console.log(`addCaseAction: Total size of processed files: ${(totalFilesSize / (1024*1024)).toFixed(2)} MB`);

    if (uploadedImageUrls.length === 0 && validFiles.length > 0) {
      console.log('addCaseAction: Valid files were present, but none were successfully processed and saved.');
      return { success: false, error: 'Image processing failed. Although files were selected, none could be saved.' };
    }
    
    if (uploadedImageUrls.length === 0 && validFiles.length === 0) {
        // This case implies the client-side 'required' for file input might not be working or was bypassed.
        console.log('addCaseAction: No valid image files were uploaded. At least one image is required.');
        return { success: false, error: 'No valid image files were uploaded. At least one image is required.' };
    }
    
    console.log('addCaseAction: Image processing completed. Uploaded URLs:', uploadedImageUrls);

    const tags = (typeof tagsString === 'string' && tagsString)
                 ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag)
                 : [];

    const newCase: Case = {
      id: Date.now().toString(),
      title,
      category,
      imageUrls: uploadedImageUrls,
      description,
      fullDescription,
      tags,
    };

    console.log('addCaseAction: New case object created:', newCase);

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
    let detail = 'An unknown server error occurred.';
    if (error instanceof Error) {
        detail = `${error.name}: ${error.message}`;
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        if (error.stack) {
            console.error('Error Stack:', error.stack);
        }
    } else {
        try {
            detail = JSON.stringify(error);
        } catch {
            detail = String(error);
        }
        console.error('Error (unknown type, logged as string/JSON):', detail);
    }
    
    const finalErrorMessage = `Server Action failed. Details: ${detail.substring(0, 300)}`; // Truncate for safety
    console.log(`addCaseAction: Critical error. Returning structured error response: ${finalErrorMessage}`);
    return { success: false, error: finalErrorMessage };
  }

}