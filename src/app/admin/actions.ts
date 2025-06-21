
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
    let cases = JSON.parse(jsonData) as any[];

    // Backward compatibility: convert old structure to new media structure
    return cases.map(c => {
      if (c.imageUrls && !c.media) {
        const media = (c.imageUrls as string[]).map(url => ({ type: 'image', url } as MediaItem));
        if (c.videoUrl) {
          media.unshift({ type: 'video', url: c.videoUrl });
        }
        return { ...c, media, imageUrls: undefined, videoUrl: undefined };
      }
      return c;
    });
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
  // Authentication is handled by the layout, so the check here is removed.
  return readCasesFile();
}

export async function getCase(id: string): Promise<Case | undefined> {
  // Authentication is handled by the layout.
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

    const uploadedMedia = await saveUploadedMedia(formData);
    if (uploadedMedia.length === 0) {
      return { success: false, error: 'Требуется как минимум один медиа-файл.' };
    }

    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    const newCase: Case = {
      id: Date.now().toString(),
      title,
      category,
      media: uploadedMedia,
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
    const allCases = await readCasesFile();
    const existingCase = allCases.find(c => c.id === caseId);

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

    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    const updatedCaseData: Case = {
      ...existingCase,
      title,
      category,
      description,
      fullDescription,
      tags,
      media: finalMedia,
    };

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

    await deleteMediaFiles(caseToDelete.media);

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
