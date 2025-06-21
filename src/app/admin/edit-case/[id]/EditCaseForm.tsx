
'use client';

import type { Case } from "@/types";
import { useState, type ChangeEvent, type FormEvent, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateCaseAction } from '@/app/admin/actions';
import { useRouter } from "next/navigation";
import { GripVertical } from "lucide-react";

interface EditCaseFormProps {
  caseToEdit: Case;
}

export default function EditCaseForm({ caseToEdit }: EditCaseFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const [currentImageUrls, setCurrentImageUrls] = useState<string[]>(caseToEdit.imageUrls);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setNewFiles(Array.from(event.target.files));
      // Clear existing image previews when new files are selected for replacement
      setCurrentImageUrls([]);
    }
  };

  const handleDragSort = (isNew: boolean) => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    if (isNew) {
      setNewFiles(prev => {
        const newItems = [...prev];
        const [draggedItemContent] = newItems.splice(dragItem.current!, 1);
        newItems.splice(dragOverItem.current!, 0, draggedItemContent);
        return newItems;
      });
    } else {
      setCurrentImageUrls(prev => {
        const newItems = [...prev];
        const [draggedItemContent] = newItems.splice(dragItem.current!, 1);
        newItems.splice(dragOverItem.current!, 0, draggedItemContent);
        return newItems;
      });
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);

    const form = event.currentTarget;
    const serverActionFormData = new FormData();

    // Append all text data
    serverActionFormData.append('title', form.title.value);
    serverActionFormData.append('category', form.category.value);
    serverActionFormData.append('description', form.description.value);
    serverActionFormData.append('fullDescription', form.fullDescription.value);
    serverActionFormData.append('tags', form.tags.value);
    serverActionFormData.append('videoUrl', form.videoUrl.value);

    if (newFiles.length > 0) {
      // Logic for replacing images
      newFiles.forEach(file => {
        serverActionFormData.append('caseImages', file);
      });
    } else {
      // Logic for reordering existing images
      serverActionFormData.append('imageUrls', JSON.stringify(currentImageUrls));
    }

    try {
      const result = await updateCaseAction(caseToEdit.id, serverActionFormData);

      if (result?.success) {
        toast({
          title: "Кейс обновлен!",
          description: `Кейс "${result.case?.title}" успешно обновлен.`,
        });
        router.push('/admin');
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка обновления",
          description: result?.error || "Произошла неизвестная ошибка.",
        });
      }
    } catch (error) {
      console.error("Client-side error during form submission:", error);
      toast({
        variant: "destructive",
        title: "Ошибка отправки",
        description: "Произошла ошибка при отправке формы.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isReplacingImages = newFiles.length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Редактировать кейс</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-md">
        <div>
          <Label htmlFor="title" className="text-card-foreground">Название</Label>
          <Input id="title" name="title" type="text" defaultValue={caseToEdit.title} required className="mt-1 bg-background" />
        </div>

        <div>
          <Label htmlFor="category" className="text-card-foreground">Категория</Label>
          <Input id="category" name="category" type="text" defaultValue={caseToEdit.category} required className="mt-1 bg-background" />
        </div>
        
        <div>
            <Label>Порядок изображений (перетащите для сортировки)</Label>
            <p className="text-sm text-muted-foreground">Первое изображение будет обложкой кейса.</p>
            <div className="mt-2 space-y-2 rounded-lg border p-2">
                {(isReplacingImages ? newFiles : currentImageUrls).map((item, index) => {
                    const url = isReplacingImages ? URL.createObjectURL(item as File) : (item as string);
                    const name = isReplacingImages ? (item as File).name : (item as string).split('/').pop();
                    return (
                        <div
                            key={url}
                            className="flex items-center p-2 bg-muted rounded-md cursor-grab"
                            draggable
                            onDragStart={() => (dragItem.current = index)}
                            onDragEnter={() => (dragOverItem.current = index)}
                            onDragEnd={() => handleDragSort(isReplacingImages)}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <GripVertical className="h-5 w-5 text-muted-foreground mr-2"/>
                            <Image src={url} alt={name || 'image'} width={40} height={40} className="rounded object-cover mr-4"/>
                            <p className="text-sm text-foreground truncate">{name}</p>
                        </div>
                    );
                })}
            </div>
        </div>

        <div>
          <Label htmlFor="caseImages" className="text-card-foreground">Загрузить новые изображения (заменят старые)</Label>
          <Input
            id="caseImages"
            name="caseImages"
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-1 bg-background file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
           {isReplacingImages && <p className="text-sm text-accent-foreground mt-2 p-2 bg-accent/20 rounded-md">Выбраны новые файлы, которые заменят все текущие изображения после сохранения.</p>}
        </div>

        <div>
          <Label htmlFor="videoUrl" className="text-card-foreground">URL Видео (опционально)</Label>
          <Input id="videoUrl" name="videoUrl" type="url" defaultValue={caseToEdit.videoUrl} placeholder="https://example.com/video.mp4" className="mt-1 bg-background border-input text-foreground" />
        </div>

        <div>
          <Label htmlFor="description" className="text-card-foreground">Краткое описание</Label>
          <Textarea id="description" name="description" defaultValue={caseToEdit.description} required rows={3} className="mt-1 bg-background" />
        </div>

        <div>
          <Label htmlFor="fullDescription" className="text-card-foreground">Полное описание</Label>
          <Textarea id="fullDescription" name="fullDescription" defaultValue={caseToEdit.fullDescription} required rows={6} className="mt-1 bg-background" />
        </div>

        <div>
          <Label htmlFor="tags" className="text-card-foreground">Теги (через запятую)</Label>
          <Input id="tags" name="tags" type="text" defaultValue={caseToEdit.tags.join(', ')} placeholder="tag1, tag2, tag3" className="mt-1 bg-background" />
        </div>
        
        <div className="flex space-x-2">
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin')}>
              Отмена
            </Button>
        </div>
      </form>
    </div>
  );
}
