
'use server';

import type { Case, MediaItem } from "@/types";
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const UPLOADS_BASE_DIR_RELATIVE = 'uploads';
const COVERS_SUBDIR = 'covers';
const HOVERS_SUBDIR = 'hovers';
const CASES_SUBDIR = 'cases';
const CLIENTS_SUBDIR = 'clients';
const UPLOADS_DIR_ABSOLUTE = path.join(process.cwd(), 'public', UPLOADS_BASE_DIR_RELATIVE);
const casesFilePath = path.join(process.cwd(), 'src', 'data', 'cases.json');
const clientsFilePath = path.join(process.cwd(), 'src', 'data', 'clients.json');

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
  redirect('/admin');
}

// --- Case Data Access ---
async function readCasesFile(): Promise<Case[]> {
  try {
    await fs.mkdir(path.dirname(casesFilePath), { recursive: true });
    const jsonData = await fs.readFile(casesFilePath, 'utf-8');
    // Ensure all cases have a media property
    const cases = (JSON.parse(jsonData) as Case[]).map(c => ({ media: [], ...c }));
    return cases;
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

async function saveUploadedFile(file: File, subfolder: string): Promise<string> {
  const uploadDir = path.join(UPLOADS_DIR_ABSOLUTE, subfolder);
  await fs.mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const originalFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueFilename = `${Date.now()}_${originalFilename}`;
  const filePath = path.join(uploadDir, uniqueFilename);
  await fs.writeFile(filePath, buffer);

  return `/${UPLOADS_BASE_DIR_RELATIVE}/${subfolder}/${uniqueFilename}`;
}

async function saveUploadedMedia(formData: FormData): Promise<MediaItem[]> {
  const mediaFileObjects = formData.getAll('caseMedia');
  const uploadedMediaItems: MediaItem[] = [];
  const validFiles = mediaFileObjects.filter(file => file instanceof File && file.name && file.size > 0);

  for (const file of validFiles) {
    const currentFile = file as File;
    const url = await saveUploadedFile(currentFile, CASES_SUBDIR);
    const fileType = currentFile.type.startsWith('video') ? 'video' : 'image';
    uploadedMediaItems.push({ type: fileType, url });
  }
  return uploadedMediaItems;
}

async function deleteFileByUrl(url: string | undefined | null) {
  if (!url || !url.startsWith(`/${UPLOADS_BASE_DIR_RELATIVE}/`)) {
    return;
  }
  try {
    const relativePath = url.substring(1);
    const absolutePath = path.join(process.cwd(), 'public', relativePath);
    await fs.unlink(absolutePath);
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && err.code !== 'ENOENT') {
      console.error(`Error deleting file ${url}:`, err);
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

    const coverFile = formData.get('coverImage') as File;
    if (!coverFile || coverFile.size === 0) {
      return { success: false, error: 'Обложка обязательна.' };
    }
    const coverUrl = await saveUploadedFile(coverFile, COVERS_SUBDIR);

    const hoverFile = formData.get('hoverImage') as File;
    let hoverImageUrl: string | undefined = undefined;
    if (hoverFile && hoverFile.size > 0) {
      hoverImageUrl = await saveUploadedFile(hoverFile, HOVERS_SUBDIR);
    }

    const uploadedMedia = await saveUploadedMedia(formData);

    let newCase: Case;

    if (type === 'modal') {
      const description = formData.get('description') as string;
      const fullDescription = formData.get('fullDescription') as string;
      const tagsString = formData.get('tags') as string;
      const externalUrl = formData.get('externalUrl') as string | null;

      if (!description || !fullDescription) {
        return { success: false, error: 'Краткое и полное описание обязательны.' };
      }
      const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      newCase = {
        id: Date.now().toString(),
        title,
        category,
        coverUrl,
        hoverImageUrl,
        media: uploadedMedia,
        type: 'modal',
        description,
        fullDescription,
        tags,
        externalUrl: externalUrl || undefined
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
        coverUrl,
        hoverImageUrl,
        media: [], // Links don't have modal media
        type: 'link',
        externalUrl,
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

    // Handle cover update
    let finalCoverUrl = existingCase.coverUrl;
    const newCoverFile = formData.get('coverImage') as File;
    if (newCoverFile && newCoverFile.size > 0) {
      await deleteFileByUrl(existingCase.coverUrl);
      finalCoverUrl = await saveUploadedFile(newCoverFile, COVERS_SUBDIR);
    }

    // Handle hover image update
    let finalHoverImageUrl = existingCase.hoverImageUrl;
    const newHoverFile = formData.get('hoverImage') as File;
    if (newHoverFile && newHoverFile.size > 0) {
      await deleteFileByUrl(existingCase.hoverImageUrl);
      finalHoverImageUrl = await saveUploadedFile(newHoverFile, HOVERS_SUBDIR);
    }


    // Handle modal media update
    let finalMedia: MediaItem[] = existingCase.media || [];
    const newFilesProvided = (formData.getAll('caseMedia').filter(f => f instanceof File && f.size > 0)).length > 0;

    if (newFilesProvided) {
      // Replace all old media if new files are uploaded
      await Promise.all(finalMedia.map(item => deleteFileByUrl(item.url)));
      finalMedia = await saveUploadedMedia(formData);
    } else {
      // Reorder existing media
      const mediaOrderString = formData.get('mediaOrder') as string;
      finalMedia = mediaOrderString ? JSON.parse(mediaOrderString) : existingCase.media;
    }


    let updatedCaseData: Partial<Case>;

    if (type === 'modal') {
      const description = formData.get('description') as string;
      const fullDescription = formData.get('fullDescription') as string;
      const tagsString = formData.get('tags') as string;
      const externalUrl = formData.get('externalUrl') as string | null;

      if (!description || !fullDescription) {
        return { success: false, error: 'Краткое и полное описание обязательны.' };
      }
      const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      updatedCaseData = {
        title,
        category,
        coverUrl: finalCoverUrl,
        hoverImageUrl: finalHoverImageUrl,
        media: finalMedia,
        type: 'modal',
        description,
        fullDescription,
        tags,
        externalUrl: externalUrl || undefined,
      };
    } else { // type === 'link'
      const externalUrl = formData.get('externalUrl') as string;
      if (!externalUrl) {
        return { success: false, error: 'Внешняя ссылка обязательна.' };
      }
      updatedCaseData = {
        title,
        category,
        coverUrl: finalCoverUrl,
        hoverImageUrl: finalHoverImageUrl,
        media: [], // Links don't have modal media. Delete old ones.
        type: 'link',
        externalUrl,
        description: undefined,
        fullDescription: undefined,
        tags: undefined,
      };
      if (existingCase.type === 'modal' && existingCase.media.length > 0) {
        await Promise.all(existingCase.media.map(item => deleteFileByUrl(item.url)));
      }
    }

    const fullUpdatedCase = { ...existingCase, ...updatedCaseData };
    const updatedCases = allCases.map(c => c.id === caseId ? fullUpdatedCase : c);
    await writeCasesFile(updatedCases);

    revalidatePath('/');
    revalidatePath('/cases');
    revalidatePath('/admin');
    revalidatePath(`/admin/edit-case/${caseId}`);

    return { success: true, case: fullUpdatedCase };
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

    await deleteFileByUrl(caseToDelete.coverUrl);
    await deleteFileByUrl(caseToDelete.hoverImageUrl);
    await Promise.all((caseToDelete.media || []).map(item => deleteFileByUrl(item.url)));


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

export async function updateCasesOrderAction(orderedCases: Case[]): Promise<{ success: boolean; error?: string }> {
  try {
    // Basic validation
    if (!Array.isArray(orderedCases)) {
      return { success: false, error: 'Неверный формат данных.' };
    }

    // Overwrite the file with the new order
    await writeCasesFile(orderedCases);

    // Revalidate paths to reflect changes
    revalidatePath('/');
    revalidatePath('/cases');
    revalidatePath('/admin');

    return { success: true };
  } catch (error: unknown) {
    console.error('Error in updateCasesOrderAction:', error);
    return { success: false, error: 'Произошла ошибка на сервере при сохранении порядка.' };
  }
}

// --- CLIENT/LOGOS Data Access ---
interface Client {
  id: string;
  name: string;
  src: string;
  order: number;
}

async function readClientsFile(): Promise<Client[]> {
  try {
    await fs.mkdir(path.dirname(clientsFilePath), { recursive: true });
    const jsonData = await fs.readFile(clientsFilePath, 'utf-8');
    return JSON.parse(jsonData) as Client[];
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      await writeClientsFile([]);
      return [];
    }
    console.error('Error reading clients.json:', error);
    throw new Error(`Failed to read clients.json: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function writeClientsFile(clients: Client[]): Promise<void> {
  try {
    const jsonData = JSON.stringify(clients, null, 2);
    await fs.writeFile(clientsFilePath, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error writing clients.json:', error);
    throw new Error(`Failed to write clients.json: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getClients(): Promise<Client[]> {
  const clients = await readClientsFile();
  return clients.sort((a, b) => a.order - b.order);
}

export async function addClientAction(formData: FormData): Promise<{ success: boolean; client?: Client; error?: string }> {
  try {
    const name = formData.get('name') as string;
    const imageFile = formData.get('logoImage') as File;
    const imagePath = formData.get('imagePath') as string;

    if (!name) {
      return { success: false, error: 'Название обязательно.' };
    }

    // Determine which image source to use
    let finalImagePath: string;

    if (imageFile && imageFile.size > 0) {
      // New uploaded file
      const uploadUrl = await saveUploadedFile(imageFile, CLIENTS_SUBDIR);
      finalImagePath = uploadUrl;
    } else if (imagePath) {
      // Existing image from dropdown
      finalImagePath = imagePath;
    } else {
      return { success: false, error: 'Выберите или загрузите изображение логотипа.' };
    }

    const clients = await readClientsFile();
    const maxOrder = clients.length > 0 ? Math.max(...clients.map(c => c.order)) : 0;

    const newClient: Client = {
      id: Date.now().toString(),
      name,
      src: finalImagePath,
      order: maxOrder + 1,
    };

    clients.push(newClient);
    await writeClientsFile(clients.sort((a, b) => a.order - b.order));

    revalidatePath('/');
    revalidatePath('/admin/clients');

    return { success: true, client: newClient };
  } catch (error: unknown) {
    console.error('Error in addClientAction:', error);
    return { success: false, error: 'Произошла ошибка при добавлении логотипа.' };
  }
}

export async function deleteClientAction(clientId: string): Promise<{ success: boolean; error?: string }> {
  try {
    let clients = await readClientsFile();
    const clientToDelete = clients.find(c => c.id === clientId);

    if (!clientToDelete) {
      return { success: false, error: 'Логотип не найден.' };
    }

    clients = clients.filter(c => c.id !== clientId);
    await writeClientsFile(clients);

    revalidatePath('/');
    revalidatePath('/admin/clients');

    return { success: true };
  } catch (error: unknown) {
    console.error('Error in deleteClientAction:', error);
    return { success: false, error: 'Произошла ошибка при удалении логотипа.' };
  }
}

export async function updateClientsOrderAction(orderedClients: Client[]): Promise<{ success: boolean; error?: string }> {
  try {
    if (!Array.isArray(orderedClients)) {
      return { success: false, error: 'Неверный формат данных.' };
    }

    // Update order numbers based on array position
    const updatedClients = orderedClients.map((client, index) => ({
      ...client,
      order: index + 1,
    }));

    await writeClientsFile(updatedClients);

    revalidatePath('/');
    revalidatePath('/admin/clients');

    return { success: true };
  } catch (error: unknown) {
    console.error('Error in updateClientsOrderAction:', error);
    return { success: false, error: 'Произошла ошибка при сохранении порядка логотипов.' };
  }
}
