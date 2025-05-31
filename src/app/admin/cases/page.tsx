
'use client'; 

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Case } from "@/types";
import fs from 'fs/promises'; 
import path from 'path';     
import { revalidatePath } from 'next/cache';
import { useToast } from "@/hooks/use-toast";

const casesFilePath = path.join(process.cwd(), 'src', 'data', 'cases.json');
const UPLOADS_DIR_RELATIVE_TO_PUBLIC = 'uploads/cases';
const UPLOADS_DIR_ABSOLUTE = path.join(process.cwd(), 'public', UPLOADS_DIR_RELATIVE_TO_PUBLIC);

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
    return [];
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

async function addCaseAction(formData: FormData) {
  'use server';
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
    id: Date.now().toString(), 
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
    revalidatePath('/'); 
    revalidatePath('/admin/cases'); 
    console.log('Case added successfully (local storage):', newCase.title);
    return { success: true, case: newCase };
  } catch (error) {
    console.error('Failed to add case to JSON:', error);
    return { success: false, error: 'Failed to save case data to JSON.' };
  }
}


export default function AdminCasesPage() {
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "No Files Selected",
        description: "Please select images for the case.",
      });
      return;
    }
    setIsProcessing(true);

    const currentForm = event.currentTarget;
    const clientFormData = new FormData(currentForm); // Contains text fields
    
    const serverActionFormData = new FormData();
    serverActionFormData.append('title', clientFormData.get('title') || '');
    serverActionFormData.append('category', clientFormData.get('category') || '');
    serverActionFormData.append('description', clientFormData.get('description') || '');
    serverActionFormData.append('fullDescription', clientFormData.get('fullDescription') || '');
    serverActionFormData.append('tags', clientFormData.get('tags') || '');

    // Append files to the FormData for the server action
    for (let i = 0; i < selectedFiles.length; i++) {
      serverActionFormData.append('caseImages', selectedFiles[i]);
    }
    
    const result = await addCaseAction(serverActionFormData);

    if (result?.success) {
      toast({
        title: "Case Added!",
        description: `Successfully added "${result.case?.title}". Images saved locally.`,
      });
      currentForm.reset(); 
      setSelectedFiles(null); 
    } else {
      toast({
        variant: "destructive",
        title: "Failed to Add Case",
        description: result?.error || "An unknown error occurred.",
      });
    }
    setIsProcessing(false);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Админ: Добавить новый кейс (Локальное хранилище)</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Внимание: Изображения будут сохранены локально в папке `public/uploads/cases`. 
        Это решение подходит для локальной разработки, но не рекомендуется для продакшена на серверлес-платформах, 
        так как файлы могут быть утеряны.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-card p-6 rounded-lg shadow-md">
        <div>
          <Label htmlFor="title" className="text-card-foreground">Название</Label>
          <Input id="title" name="title" type="text" required className="mt-1 bg-background border-input text-foreground" />
        </div>
        
        <div>
          <Label htmlFor="category" className="text-card-foreground">Категория</Label>
          <Input id="category" name="category" type="text" required className="mt-1 bg-background border-input text-foreground" />
        </div>
        
        <div>
          <Label htmlFor="caseImagesInput" className="text-card-foreground">Изображения кейса</Label>
          <Input 
            id="caseImagesInput" // Changed ID to avoid conflict if name="caseImages" was used by mistake
            name="caseImagesInput" // Name for the input element itself, not for FormData key
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleFileChange} 
            className="mt-1 bg-background border-input text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" 
          />
          {selectedFiles && Array.from(selectedFiles).map(file => (
             <div key={file.name} className="mt-2">
                <p className="text-sm text-muted-foreground">{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
             </div>
          ))}
        </div>
        
        <div>
          <Label htmlFor="description" className="text-card-foreground">Краткое описание (для карточки)</Label>
          <Textarea id="description" name="description" required rows={3} className="mt-1 bg-background border-input text-foreground" />
        </div>
        
        <div>
          <Label htmlFor="fullDescription" className="text-card-foreground">Полное описание (для модального окна)</Label>
          <Textarea id="fullDescription" name="fullDescription" required rows={6} className="mt-1 bg-background border-input text-foreground" />
        </div>

        <div>
          <Label htmlFor="tags" className="text-card-foreground">Теги (через запятую)</Label>
          <Input id="tags" name="tags" type="text" placeholder="tag1, tag2, tag3" className="mt-1 bg-background border-input text-foreground" />
        </div>
        
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isProcessing}>
          {isProcessing ? 'Обработка...' : 'Добавить кейс'}
        </Button>
      </form>
    </div>
  );
}
