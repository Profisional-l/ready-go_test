
'use server';

import type { Case, MediaItem } from "@/types";
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const casesFilePath = path.join(process.cwd(), 'src', 'data', 'cases.json');
const UPLOADS_DIR_RELATIVE_TO_PUBLIC = 'uploads/cases';
const UPLOADS_DIR_ABSOLUTE = path.join(process.cwd(), 'public', UPLOADS_DIR_RELATIVE_TO_PUBLIC);

const AUTH_COOKIE_NAME = 'admin-auth-readygo-cases';

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
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'lax',
    });
    // Redirect to the admin dashboard on successful login
    redirect('/admin');
  } else {
    return { success: false, error: 'Неверный пароль.' };
  }
}

export async function logoutAction(): Promise<void> {
  cookies().set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
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
  return readCasesFile();
}

export async function getCase(id: string): Promise<Case | undefined> {
  const cases = await readCasesFile();
  return cases.find(c => c.id === id);
}

// --- File Operations ---
async function saveUploadedMedia(formData: FormData): Promise<MediaItem[]> {
  await fs.mkdir(UPLOADS_DIR_ABSOLUTE, { recursive: true });
  const mediaFileObjects = formData.getAll('caseMedia');
  const uploadedMediaItems: MediaItem[] = [];
  const validFiles = mediaFileObjects.filter(file => file instanceof File && file.name && file.size > 0);

  for (const file of validFiles) {
    const currentFile = file as File;
    const bytes = await currentFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const originalFilename = currentFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueFilename = `${Date.now()}_${originalFilename}`;
    const filePath = path.join(UPLOADS_DIR_ABSOLUTE, uniqueFilename);
    await fs.writeFile(filePath, buffer);
    
    const fileType = currentFile.type.startsWith('video') ? 'video' : 'image';
    
    uploadedMediaItems.push({
      type: fileType,
      url: `/${UPLOADS_DIR_RELATIVE_TO_PUBLIC}/${uniqueFilename}`
    });
  }
  return uploadedMediaItems;
}

async function deleteMediaFiles(mediaItems: MediaItem[]): Promise<void> {
  for (const item of mediaItems) {
    if (item.url.startsWith(`/${UPLOADS_DIR_RELATIVE_TO_PUBLIC}/`)) {
      const filename = path.basename(item.url);
      const filePath = path.join(UPLOADS_DIR_ABSOLUTE, filename);
      try {
        await fs.unlink(filePath);
        console.log(`Deleted media file: ${filePath}`);
      } catch (err) {
        console.error(`Error deleting media file ${filePath}:`, err);
      }
    }
  }
}

// --- Case CRUD Actions ---
export async function addCaseAction(formData: FormData): Promise<{ success: boolean; case?: Case; error?: string; }> {
  try {
    const type = formData.get('type') as 'modal' | 'link';
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    
    if (!title || !category) {
      return { success: false, error: 'Название и категория обязательны.' };
    }

    const uploadedMedia = await saveUploadedMedia(formData);
    if (uploadedMedia.length === 0) {
      return { success: false, error: 'Требуется как минимум один медиа-файл.' };
    }
    
    let newCase: Case;

    if (type === 'modal') {
      const description = formData.get('description') as string;
      const fullDescription = formData.get('fullDescription') as string;
      const tagsString = formData.get('tags') as string;
      if (!description || !fullDescription) {
        return { success: false, error: 'Краткое и полное описание обязательны.' };
      }
      const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      newCase = {
        id: Date.now().toString(),
        title,
        category,
        media: uploadedMedia,
        type: 'modal',
        description,
        fullDescription,
        tags,
      };
    } else { // type === 'link'
      const externalUrl = formData.get('externalUrl') as string;
      if (!externalUrl) {
        return { success: false, error: 'Внешняя ссылка обязательна.' };
      }
      newCase = {
        id: Date.now().toString(),
        title,
        category,
        media: uploadedMedia,
        type: 'link',
        externalUrl,
        description: '',
        fullDescription: '',
        tags: [],
      };
    }

    const existingCases = await readCasesFile();
    await writeCasesFile([...existingCases, newCase]);
    
    revalidatePath('/');
    revalidatePath('/cases');
    revalidatePath('/admin');
    
    return { success: true, case: newCase };
  } catch (error: unknown) {
    console.error('Error in addCaseAction:', error);
    return { success: false, error: 'Произошла ошибка на сервере при добавлении кейса.' };
  }
}

export async function updateCaseAction(caseId: string, formData: FormData): Promise<{ success: boolean; case?: Case; error?: string; }> {
  try {
    const allCases = await readCasesFile();
    const existingCase = allCases.find(c => c.id === caseId);

    if (!existingCase) {
      return { success: false, error: 'Кейс не найден.' };
    }

    const type = formData.get('type') as 'modal' | 'link';
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;

    if (!title || !category) {
      return { success: false, error: 'Название и категория обязательны.' };
    }
    
    let finalMedia: MediaItem[];
    const newFilesProvided = (formData.getAll('caseMedia').filter(f => f instanceof File && f.size > 0)).length > 0;

    if (newFilesProvided) {
      await deleteMediaFiles(existingCase.media);
      finalMedia = await saveUploadedMedia(formData);
      if (finalMedia.length === 0) {
        return { success: false, error: 'Ошибка при загрузке новых медиа-файлов.' };
      }
    } else {
      const mediaOrderString = formData.get('mediaOrder') as string;
      finalMedia = mediaOrderString ? JSON.parse(mediaOrderString) : existingCase.media;
    }

    let updatedCaseData: Case;

    if (type === 'modal') {
      const description = formData.get('description') as string;
      const fullDescription = formData.get('fullDescription') as string;
      const tagsString = formData.get('tags') as string;
      if (!description || !fullDescription) {
        return { success: false, error: 'Краткое и полное описание обязательны.' };
      }
      const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      updatedCaseData = {
        ...existingCase,
        title,
        category,
        media: finalMedia,
        type: 'modal',
        description,
        fullDescription,
        tags,
        externalUrl: '',
      };
    } else { // type === 'link'
      const externalUrl = formData.get('externalUrl') as string;
      if (!externalUrl) {
        return { success: false, error: 'Внешняя ссылка обязательна.' };
      }
      updatedCaseData = {
        ...existingCase,
        title,
        category,
        media: finalMedia,
        type: 'link',
        externalUrl,
        description: '',
        fullDescription: '',
        tags: [],
      };
    }


    const updatedCases = allCases.map(c => c.id === caseId ? updatedCaseData : c);
    await writeCasesFile(updatedCases);

    revalidatePath('/');
    revalidatePath('/cases');
    revalidatePath('/admin');
    revalidatePath(`/admin/edit-case/${caseId}`);
    
    return { success: true, case: updatedCaseData };
  } catch (error: unknown) {
    console.error('Error in updateCaseAction:', error);
    return { success: false, error: 'Произошла ошибка на сервере при обновлении кейса.' };
  }
}

export async function deleteCaseAction(caseId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cases = await readCasesFile();
    const caseToDelete = cases.find(c => c.id === caseId);

    if (!caseToDelete) {
      return { success: false, error: 'Кейс не найден.' };
    }

    await deleteMediaFiles(caseToDelete.media);

    const updatedCases = cases.filter(c => c.id !== caseId);
    await writeCasesFile(updatedCases);

    revalidatePath('/');
    revalidatePath('/cases');
    revalidatePath('/admin');

    return { success: true };
  } catch (error: unknown) {
    console.error('Error in deleteCaseAction:', error);
    return { success: false, error: 'Произошла ошибка на сервере при удалении кейса.' };
  }
}
