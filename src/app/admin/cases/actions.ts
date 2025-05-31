
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
      // File doesn't exist, create it with an empty array
      await writeCasesFile([]);
      return [];
    }
    console.error('Error reading cases.json:', error);
    return []; // Return empty array or handle error as appropriate
  }
}

async function writeCasesFile(cases: Case[]): Promise<void> {
  try {
    // Ensure the directory exists
    await fs.mkdir(path.dirname(casesFilePath), { recursive: true });
    const jsonData = JSON.stringify(cases, null, 2);
    await fs.writeFile(casesFilePath, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error writing cases.json:', error);
    throw error; // Re-throw to be caught by the caller
  }
}

export async function addCaseAction(formData: FormData): Promise<{ success: boolean; case?: Case; error?: string; }> {
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const fullDescription = formData.get('fullDescription') as string;
  const tagsString = formData.get('tags') as string;

  const imageFiles = formData.getAll('caseImages') as File[];
  const uploadedImageUrls: string[] = [];

  if (!title || !category || !description || !fullDescription) {
    return { success: false, error: 'Missing required text fields' };
  }

  try {
    // Create uploads directory if it doesn't exist
    await fs.mkdir(UPLOADS_DIR_ABSOLUTE, { recursive: true });

    for (const file of imageFiles) {
      if (file.size === 0) continue; // Skip if a file input was left empty

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create a unique filename, sanitize it
      const originalFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_'); // Basic sanitization
      const uniqueFilename = `${Date.now()}_${originalFilename}`;
      const filePath = path.join(UPLOADS_DIR_ABSOLUTE, uniqueFilename);

      await fs.writeFile(filePath, buffer);
      uploadedImageUrls.push(`/${UPLOADS_DIR_RELATIVE_TO_PUBLIC}/${uniqueFilename}`);
    }
  } catch (error) {
    console.error('Failed to upload images:', error);
    return { success: false, error: 'Failed to upload images to server.' };
  }

  const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);

  const newCase: Case = {
    id: Date.now().toString(), // Simple ID generation
    title,
    category,
    imageUrls: uploadedImageUrls,
    description,
    fullDescription,
    tags,
  };

  try {
    const existingCases = await readCasesFile();
    const updatedCases = [...existingCases, newCase];
    await writeCasesFile(updatedCases);
    revalidatePath('/'); // Revalidate the homepage to show the new case
    revalidatePath('/admin/cases'); // Revalidate the admin page itself if needed
    console.log('Case added successfully (local storage):', newCase.title);
    return { success: true, case: newCase };
  } catch (error) {
    console.error('Failed to add case to JSON:', error);
    return { success: false, error: 'Failed to save case data to JSON.' };
  }
}
