
'use client';

import type { Case, MediaItem } from "@/types";
import { useState, type ChangeEvent, type FormEvent, useRef } from "react";
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

const MediaPreview = ({ item }: { item: MediaItem | File }) => {
  const isFile = item instanceof File;
  const url = isFile ? URL.createObjectURL(item) : item.url;
  const type = isFile ? (item.type.startsWith('video') ? 'video' : 'image') : item.type;
  const name = isFile ? item.name : item.url.split('/').pop();

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-10 h-10">
        {type === 'video' ? (
          <video src={url} className="w-full h-full object-cover rounded" />
        ) : (
          <Image
            src={url}
            alt={name || 'media'}
            width={40}
            height={40}
            unoptimized
            className="rounded object-cover"
          />
        )}
      </div>
      <p className="text-sm text-foreground truncate">{name}</p>
    </div>
  );
};


export default function EditCaseForm({ caseToEdit }: EditCaseFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const [mediaItems, setMediaItems] = useState<(MediaItem | File)[]>(caseToEdit.media);
  const [isProcessing, setIsProcessing] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // Logic for replacing all media
      setMediaItems(Array.from(event.target.files));
    }
  };

  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    setMediaItems(prev => {
        const newItems = [...prev];
        const [draggedItemContent] = newItems.splice(dragItem.current!, 1);
        newItems.splice(dragOverItem.current!, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        return newItems;
      });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);

    const form = event.currentTarget;
    const serverActionFormData = new FormData();

    serverActionFormData.append('title', form.title.value);
    serverActionFormData.append('category', form.category.value);
    serverActionFormData.append('description', form.description.value);
    serverActionFormData.append('fullDescription', form.fullDescription.value);
    serverActionFormData.append('tags', form.tags.value);

    const newFiles = mediaItems.filter(item => item instanceof File) as File[];
    const existingMedia = mediaItems.filter(item => !(item instanceof File)) as MediaItem[];

    if (newFiles.length > 0) {
        // If there are new files, we assume it's a full replacement
        newFiles.forEach(file => {
            serverActionFormData.append('caseMedia', file);
        });
    } else {
        // If no new files, we are just reordering existing ones
        serverActionFormData.append('mediaOrder', JSON.stringify(existingMedia));
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
  
  const isReplacingMedia = mediaItems.some(item => item instanceof File);

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
            <Label>Порядок медиа (перетащите для сортировки)</Label>
            <p className="text-sm text-muted-foreground">Первый элемент будет обложкой кейса.</p>
            <div className="mt-2 space-y-2 rounded-lg border p-2">
                {mediaItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center p-2 bg-muted rounded-md cursor-grab"
                        draggable
                        onDragStart={() => (dragItem.current = index)}
                        onDragEnter={() => (dragOverItem.current = index)}
                        onDragEnd={handleDragSort}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <GripVertical className="h-5 w-5 text-muted-foreground mr-2"/>
                        <MediaPreview item={item} />
                    </div>
                ))}
            </div>
        </div>

        <div>
          <Label htmlFor="caseMedia" className="text-card-foreground">Загрузить новые файлы (заменят старые)</Label>
          <Input
            id="caseMedia"
            name="caseMediaInput"
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="mt-1 bg-background file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
           {isReplacingMedia && <p className="text-sm text-accent-foreground mt-2 p-2 bg-accent/20 rounded-md">Выбраны новые файлы. После сохранения они заменят все текущие медиа-файлы.</p>}
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
