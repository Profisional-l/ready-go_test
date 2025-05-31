
'use client'; 

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Case } from "@/types";
import fs from 'fs/promises'; // This Server Action will still use fs
import path from 'path';     // This Server Action will still use fs
import { revalidatePath } from 'next/cache';
import { storage } from '@/lib/firebase'; // Firebase storage instance
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const casesFilePath = path.join(process.cwd(), 'src', 'data', 'cases.json');

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

// Server Action - remains largely the same but expects imageUrls as an array
async function addCaseAction(formData: FormData) {
  'use server';
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  // imageUrls will now be passed directly as an array of strings by the client
  const imageUrls = formData.getAll('imageUrls') as string[]; 
  const description = formData.get('description') as string;
  const fullDescription = formData.get('fullDescription') as string;
  const tagsString = formData.get('tags') as string;

  const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);

  if (!title || !category || !description || !fullDescription) {
    // Basic validation, imageUrls can be empty if no files were uploaded or if upload failed client-side
    console.error('Missing required text fields');
    // Consider returning an error object that client-side can handle
    return { success: false, error: 'Missing required text fields' };
  }

  const newCase: Case = {
    id: Date.now().toString(), 
    title,
    category,
    imageUrls, // Already an array of strings
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
    console.log('Case added successfully:', newCase.title);
    return { success: true, case: newCase };
  } catch (error) {
    console.error('Failed to add case:', error);
    return { success: false, error: 'Failed to save case data.' };
  }
}


export default function AdminCasesPage() {
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({}); // Progress per file

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
      setUploadProgress({}); // Reset progress when new files are selected
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);
    setUploadProgress({});

    const currentFormData = new FormData(event.currentTarget);
    const uploadedImageUrls: string[] = [];

    if (selectedFiles && selectedFiles.length > 0) {
      const uploadPromises = Array.from(selectedFiles).map(file => {
        const fileRef = storageRef(storage, `cases/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        return new Promise<string>((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
            },
            (error) => {
              console.error("Upload failed for file:", file.name, error);
              toast({
                variant: "destructive",
                title: "Upload Failed",
                description: `Could not upload ${file.name}.`,
              });
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                uploadedImageUrls.push(downloadURL);
                resolve(downloadURL);
              } catch (error) {
                console.error("Failed to get download URL for file:", file.name, error);
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: `Could not get URL for ${file.name}.`,
                });
                reject(error);
              }
            }
          );
        });
      });

      try {
        await Promise.all(uploadPromises);
      } catch (error) {
        // Errors are handled by individual upload toasts
        setIsUploading(false);
        return; // Stop if any upload fails
      }
    }
    
    // Prepare FormData for the Server Action
    const serverActionFormData = new FormData();
    serverActionFormData.append('title', currentFormData.get('title') || '');
    serverActionFormData.append('category', currentFormData.get('category') || '');
    serverActionFormData.append('description', currentFormData.get('description') || '');
    serverActionFormData.append('fullDescription', currentFormData.get('fullDescription') || '');
    serverActionFormData.append('tags', currentFormData.get('tags') || '');
    
    uploadedImageUrls.forEach(url => {
      serverActionFormData.append('imageUrls', url);
    });

    const result = await addCaseAction(serverActionFormData);

    if (result?.success) {
      toast({
        title: "Case Added!",
        description: `Successfully added "${result.case?.title}".`,
      });
      (event.target as HTMLFormElement).reset(); // Reset form fields
      setSelectedFiles(null); // Clear selected files
    } else {
      toast({
        variant: "destructive",
        title: "Failed to Add Case",
        description: result?.error || "An unknown error occurred.",
      });
    }
    setIsUploading(false);
    setUploadProgress({});
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Админ: Добавить новый кейс</h1>
      
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
          <Label htmlFor="caseImages" className="text-card-foreground">Изображения кейса</Label>
          <Input 
            id="caseImages" 
            name="caseImages" 
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleFileChange} 
            className="mt-1 bg-background border-input text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" 
          />
          {selectedFiles && Array.from(selectedFiles).map(file => (
             <div key={file.name} className="mt-2">
                <p className="text-sm text-muted-foreground">{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
                {uploadProgress[file.name] !== undefined && (
                    <Progress value={uploadProgress[file.name]} className="w-full h-2 mt-1" />
                )}
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
        
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isUploading}>
          {isUploading ? 'Загрузка...' : 'Добавить кейс'}
        </Button>
      </form>
    </div>
  );
}
