'use server'; // For the entire file if actions are defined here, or move action to actions.ts

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
    // If file doesn't exist or is empty, return empty array
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading cases.json:', error);
    return [];
  }
}

async function writeCasesFile(cases: Case[]): Promise<void> {
  try {
    const jsonData = JSON.stringify(cases, null, 2);
    await fs.writeFile(casesFilePath, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error writing cases.json:', error);
    throw error; // Re-throw to handle it in the action
  }
}

async function addCaseAction(formData: FormData) {
  'use server';
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const imgSrc = formData.get('imgSrc') as string;
  const description = formData.get('description') as string;
  const fullDescription = formData.get('fullDescription') as string;
  const aiHint = formData.get('aiHint') as string | undefined;

  if (!title || !category || !imgSrc || !description || !fullDescription) {
    // Basic validation
    console.error('Missing required fields');
    // Ideally, return an error message to the client
    return;
  }

  const newCase: Case = {
    id: Date.now().toString(), // Simple unique ID
    title,
    category,
    imgSrc,
    description,
    fullDescription,
    aiHint,
  };

  try {
    const existingCases = await readCasesFile();
    const updatedCases = [...existingCases, newCase];
    await writeCasesFile(updatedCases);
    revalidatePath('/'); // Revalidate the homepage to show the new case
    // revalidatePath('/admin/cases'); // Optionally revalidate admin page if displaying cases there
    console.log('Case added successfully:', newCase.title);
    // For client-side feedback, you might redirect or use a toast
  } catch (error) {
    console.error('Failed to add case:', error);
    // Handle error, maybe return a message to the client
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
          <Label htmlFor="imgSrc" className="text-card-foreground">URL изображения</Label>
          <Input id="imgSrc" name="imgSrc" type="url" required placeholder="https://placehold.co/360x220.png" className="mt-1 bg-background border-input text-foreground" />
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
          <Label htmlFor="aiHint" className="text-card-foreground">AI Hint (для генерации изображения, 1-2 слова)</Label>
          <Input id="aiHint" name="aiHint" type="text" className="mt-1 bg-background border-input text-foreground" />
        </div>
        
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Добавить кейс</Button>
      </form>
    </div>
  );
}
