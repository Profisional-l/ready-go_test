'use server'; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Case } from "@/types";
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const casesFilePath = path.join(process.cwd(), 'src', 'data', 'cases.json');

async function readCasesFile(): Promise<Case[]> {
  try {
    const jsonData = await fs.readFile(casesFilePath, 'utf-8');
    return JSON.parse(jsonData) as Case[];
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      await writeCasesFile([]); // Create the file if it doesn't exist
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
  const imageUrlsString = formData.get('imageUrls') as string;
  const description = formData.get('description') as string;
  const fullDescription = formData.get('fullDescription') as string;
  const tagsString = formData.get('tags') as string;

  const imageUrls = imageUrlsString.split('\n').map(url => url.trim()).filter(url => url);
  const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);

  if (!title || !category || imageUrls.length === 0 || !description || !fullDescription) {
    console.error('Missing required fields');
    // Ideally, return an error message to the client
    return;
  }

  const newCase: Case = {
    id: Date.now().toString(), 
    title,
    category,
    imageUrls,
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
  } catch (error) {
    console.error('Failed to add case:', error);
  }
}


export default async function AdminCasesPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Админ: Добавить новый кейс</h1>
      
      <form action={addCaseAction} className="space-y-6 max-w-2xl bg-card p-6 rounded-lg shadow-md">
        <div>
          <Label htmlFor="title" className="text-card-foreground">Название</Label>
          <Input id="title" name="title" type="text" required className="mt-1 bg-background border-input text-foreground" />
        </div>
        
        <div>
          <Label htmlFor="category" className="text-card-foreground">Категория</Label>
          <Input id="category" name="category" type="text" required className="mt-1 bg-background border-input text-foreground" />
        </div>
        
        <div>
          <Label htmlFor="imageUrls" className="text-card-foreground">URL изображений (каждый URL с новой строки)</Label>
          <Textarea id="imageUrls" name="imageUrls" required rows={5} placeholder="https://placehold.co/800x500.png\nhttps://placehold.co/400x300.png" className="mt-1 bg-background border-input text-foreground" />
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
        
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Добавить кейс</Button>
      </form>
    </div>
  );
}
