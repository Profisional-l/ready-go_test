
'use server';

import type { Case } from "@/types";
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const casesFilePath = path.join(process.cwd(), 'src', 'data', 'cases.json');
const UPLOADS_DIR_RELATIVE_TO_PUBLIC = 'uploads/cases';
const UPLOADS_DIR_ABSOLUTE = path.join(process.cwd(), 'public', UPLOADS_DIR_RELATIVE_TO_PUBLIC);

const AUTH_COOKIE_NAME = 'admin-auth-readygo-cases'; // Keeping original name for now

// --- Authentication ---
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value === 'true';
}

export async function verifyPasswordAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const password = formData.get('password') as string;
  const adminPassword = process.env.ADMIN_CASES_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_CASES_PASSWORD is not set in environment variables.');
    return { success: false, error: 'Ошибка конфигурации сервера.' };
  }

  if (password === adminPassword) {
    cookies().set(AUTH_COOKIE_NAME, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/admin', // Changed path to /admin
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'lax',
    });
    revalidatePath('/admin');
    return { success: true };
  } else {
    return { success: false, error: 'Неверный пароль.' };
  }
}

export async function logoutAction(): Promise<void> {
  cookies().set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/admin', // Changed path to /admin
    expires: new Date(0),
    sameSite: 'lax',
  });
  revalidatePath('/admin');
  redirect('/admin');
}

// --- Case Data Access ---
async function readCasesFile(): Promise<Case[]> {
  try {
    const jsonData = await fs.readFile(casesFilePath, 'utf-8');
    return JSON.parse(jsonData) as Case[];
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      await writeCasesFile([]);
      return [];
    }
    console.error('Error reading cases.json:', error);
    throw new Error(`Failed to read cases.json: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function writeCasesFile(cases: Case[]): Promise<void> {
  try {
    const casesDir = path.dirname(casesFilePath);
    await fs.mkdir(casesDir, { recursive: true });
    const jsonData = JSON.stringify(cases, null, 2);
    await fs.writeFile(casesFilePath, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error writing cases.json:', error);
    throw new Error(`Failed to write cases.json: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getCases(): Promise<Case[]> {
  if (!(await isAuthenticated())) {
    // Or throw error / return empty array depending on how you want to handle unauthorized access here
    // For page display, the layout should prevent access. For direct action calls, this is a safeguard.
    console.warn('getCases called without authentication.');
    return []; 
  }
  return readCasesFile();
}

export async function getCase(id: string): Promise<Case | undefined> {
  if (!(await isAuthenticated())) {
    console.warn(`getCase(${id}) called without authentication.`);
    return undefined;
  }
  const cases = await readCasesFile();
  return cases.find(c => c.id === id);
}

// --- File Operations ---
async function saveUploadedFiles(formData: FormData): Promise<string[]> {
  await fs.mkdir(UPLOADS_DIR_ABSOLUTE, { recursive: true });
  const imageFileObjects = formData.getAll('caseImages');
  const uploadedImageUrls: string[] = [];
  const validFiles = imageFileObjects.filter(file => file instanceof File && file.name && file.size > 0);

  for (const file of validFiles) {
    const currentFile = file as File;
    const bytes = await currentFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const originalFilename = currentFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueFilename = `${Date.now()}_${originalFilename}`;
    const filePath = path.join(UPLOADS_DIR_ABSOLUTE, uniqueFilename);
    await fs.writeFile(filePath, buffer);
    uploadedImageUrls.push(`/${UPLOADS_DIR_RELATIVE_TO_PUBLIC}/${uniqueFilename}`);
  }
  return uploadedImageUrls;
}

async function deleteImageFiles(imageUrls: string[]): Promise<void> {
  for (const url of imageUrls) {
    if (url.startsWith(`/${UPLOADS_DIR_RELATIVE_TO_PUBLIC}/`)) {
      const filename = path.basename(url);
      const filePath = path.join(UPLOADS_DIR_ABSOLUTE, filename);
      try {
        await fs.unlink(filePath);
        console.log(`Deleted image file: ${filePath}`);
      } catch (err) {
        console.error(`Error deleting image file ${filePath}:`, err);
      }
    }
  }
}

// --- Case CRUD Actions ---
export async function addCaseAction(formData: FormData): Promise<{ success: boolean; case?: Case; error?: string; }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: 'Не авторизован.' };
  }

  try {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const fullDescription = formData.get('fullDescription') as string;
    const tagsString = formData.get('tags') as string;

    if (!title || !category || !description || !fullDescription) {
      return { success: false, error: 'Все текстовые поля обязательны.' };
    }

    const uploadedImageUrls = await saveUploadedFiles(formData);
    if (uploadedImageUrls.length === 0) {
       const imageFiles = formData.getAll('caseImages').filter(f => f instanceof File && f.size > 0);
       if (imageFiles.length > 0) {
            return { success: false, error: 'Ошибка при загрузке изображений.' };
       }
       // If no files were submitted and it's a new case, this might be an error or allowed.
       // For now, assume at least one image is typically expected for a new case.
       // If allowing no images, this check needs adjustment.
       // For this example, let's enforce at least one image for new cases from the form:
       // The form has 'required' on file input, so this state implies an issue if files were meant to be there.
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
    await writeCasesFile([...existingCases, newCase]);
    
    revalidatePath('/');
    revalidatePath('/admin');
    
    return { success: true, case: newCase };
  } catch (error: unknown) {
    const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    console.error('Error in addCaseAction:', detail);
    return { success: false, error: `Ошибка сервера: ${detail.substring(0,300)}` };
  }
}

export async function updateCaseAction(caseId: string, formData: FormData): Promise<{ success: boolean; case?: Case; error?: string; }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: 'Не авторизован.' };
  }

  try {
    const existingCase = await getCase(caseId);
    if (!existingCase) {
      return { success: false, error: 'Кейс не найден.' };
    }

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const fullDescription = formData.get('fullDescription') as string;
    const tagsString = formData.get('tags') as string;

    if (!title || !category || !description || !fullDescription) {
      return { success: false, error: 'Все текстовые поля обязательны.' };
    }
    
    let finalImageUrls = existingCase.imageUrls;
    const imageFileObjects = formData.getAll('caseImages');
    const newFilesProvided = imageFileObjects.some(file => file instanceof File && file.size > 0);

    if (newFilesProvided) {
      await deleteImageFiles(existingCase.imageUrls); // Delete old images
      finalImageUrls = await saveUploadedFiles(formData); // Save new images
      if (finalImageUrls.length === 0) {
        // This implies an error during new image upload if files were indeed provided.
        return { success: false, error: 'Ошибка при загрузке новых изображений.' };
      }
    }

    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    const updatedCaseData: Case = {
      ...existingCase,
      title,
      category,
      description,
      fullDescription,
      tags,
      imageUrls: finalImageUrls,
    };

    const allCases = await readCasesFile();
    const updatedCases = allCases.map(c => c.id === caseId ? updatedCaseData : c);
    await writeCasesFile(updatedCases);

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath(`/admin/edit-case/${caseId}`);
    
    return { success: true, case: updatedCaseData };
  } catch (error: unknown) {
    const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    console.error('Error in updateCaseAction:', detail);
    return { success: false, error: `Ошибка сервера: ${detail.substring(0,300)}` };
  }
}

export async function deleteCaseAction(caseId: string): Promise<{ success: boolean; error?: string }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: 'Не авторизован.' };
  }
  try {
    const cases = await readCasesFile();
    const caseToDelete = cases.find(c => c.id === caseId);

    if (!caseToDelete) {
      return { success: false, error: 'Кейс не найден.' };
    }

    await deleteImageFiles(caseToDelete.imageUrls);

    const updatedCases = cases.filter(c => c.id !== caseId);
    await writeCasesFile(updatedCases);

    revalidatePath('/');
    revalidatePath('/admin');

    return { success: true };
  } catch (error: unknown) {
    const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    console.error('Error in deleteCaseAction:', detail);
    return { success: false, error: `Ошибка сервера: ${detail.substring(0,300)}` };
  }
}

    