
'use client';

import type { Case, MediaItem } from "@/types";
import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateCaseAction } from '@/app/admin/actions';
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
      <p className="text-sm text-foreground truncate flex-grow">{name}</p>
    </div>
  );
};

export default function EditCaseForm({ caseToEdit }: EditCaseFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const [coverPreview, setCoverPreview] = useState<string | null>(caseToEdit.coverUrl);
  const [hoverPreview, setHoverPreview] = useState<string | null>(caseToEdit.hoverImageUrl || null);
  const [mediaItems, setMediaItems] = useState<(MediaItem | File)[]>(caseToEdit.media || []);
  const [caseType, setCaseType] = useState<'modal' | 'link'>(caseToEdit.type || 'modal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [replacingMedia, setReplacingMedia] = useState(false);
  
  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleHoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setHoverPreview(URL.createObjectURL(file));
    }
  };

  const handleMediaFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setMediaItems(Array.from(event.target.files));
      setReplacingMedia(true);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === mediaItems.length - 1) return;

    setMediaItems(prevItems => {
      const newItems = [...prevItems];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      return newItems;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);

    const form = event.currentTarget;
    const serverActionFormData = new FormData(form);

    const newHoverFile = (form.elements.namedItem('hoverImage') as HTMLInputElement).files?.[0];
    if (newHoverFile) {
        serverActionFormData.set('hoverImage', newHoverFile);
    }

    if (replacingMedia) {
        const newFiles = mediaItems.filter(item => item instanceof File) as File[];
        newFiles.forEach(file => {
            serverActionFormData.append('caseMedia', file);
        });
    } else {
        const existingMedia = mediaItems.filter(item => !(item instanceof File)) as MediaItem[];
        serverActionFormData.append('mediaOrder', JSON.stringify(existingMedia));
    }
    
    serverActionFormData.set('type', caseType);

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
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Редактировать кейс</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-md">
        
        <div>
          <Label className="text-card-foreground mb-2 block">Тип кейса</Label>
          <RadioGroup
            value={caseType}
            onValueChange={(value: 'modal' | 'link') => setCaseType(value)}
            className="flex items-center space-x-4"
            name="type"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="modal" id="r-modal" />
              <Label htmlFor="r-modal">Модальное окно</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="link" id="r-link" />
              <Label htmlFor="r-link">Внешняя ссылка</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="title" className="text-card-foreground">Название</Label>
          <Input id="title" name="title" type="text" defaultValue={caseToEdit.title} required className="mt-1 bg-background" />
        </div>

        <div>
          <Label htmlFor="category" className="text-card-foreground">Категория</Label>
          <Input id="category" name="category" type="text" defaultValue={caseToEdit.category} required className="mt-1 bg-background" />
        </div>
        
        <div>
          <Label>Текущая обложка</Label>
          {coverPreview ? (
            <div className="mt-2 relative w-32 h-32">
                <Image src={coverPreview} alt="Предпросмотр обложки" fill unoptimized className="rounded-md object-cover" />
            </div>
          ) : <p className="text-sm text-muted-foreground">Обложка не задана.</p>}
        </div>

        <div>
            <Label htmlFor="coverImage">Заменить обложку (необязательно)</Label>
            <Input id="coverImage" name="coverImage" type="file" accept="image/*" onChange={handleCoverChange} className="mt-1 bg-background" />
        </div>

        <div>
            <Label>Текущее изображение при наведении</Label>
            {hoverPreview ? (
                <div className="mt-2 relative w-32 h-32">
                    <Image src={hoverPreview} alt="Предпросмотр изображения при наведении" fill unoptimized className="rounded-md object-cover" />
                </div>
            ) : <p className="text-sm text-muted-foreground">Изображение для наведения не задано.</p>}
        </div>

        <div>
            <Label htmlFor="hoverImage">Заменить изображение при наведении</Label>
            <Input id="hoverImage" name="hoverImage" type="file" accept="image/*" onChange={handleHoverChange} className="mt-1 bg-background" />
        </div>

        {caseType === 'link' && (
          <div>
            <Label htmlFor="externalUrl">Внешняя ссылка (URL)</Label>
            <Input id="externalUrl" name="externalUrl" type="url" defaultValue={caseToEdit.externalUrl} required className="mt-1 bg-background" />
          </div>
        )}

        {caseType === 'modal' && (
          <>
            <div>
                <Label>Медиа в модальном окне</Label>
                <p className="text-sm text-muted-foreground">Используйте стрелки для сортировки.</p>
                <div className="mt-2 space-y-2 rounded-lg border p-2">
                    {mediaItems.length > 0 ? mediaItems.map((item, index) => {
                      const isFile = item instanceof File;
                      const key = isFile 
                        ? `new-${item.name}-${item.lastModified}-${index}` 
                        : `existing-${(item as MediaItem).url}-${index}`;

                      return (
                        <div key={key} className="flex items-center p-2 bg-muted rounded-md">
                            <MediaPreview item={item} />
                            <div className="flex items-center ml-auto pl-4">
                                <Button type="button" variant="ghost" size="sm" onClick={() => handleMove(index, 'up')} disabled={index === 0} aria-label="Move up"><ArrowUp className="h-4 w-4" /></Button>
                                <Button type="button" variant="ghost" size="sm" onClick={() => handleMove(index, 'down')} disabled={index === mediaItems.length - 1} aria-label="Move down"><ArrowDown className="h-4 w-4" /></Button>
                            </div>
                        </div>
                      );
                    }) : <p className="text-sm text-muted-foreground p-2">Нет медиа для модального окна.</p>}
                </div>
            </div>

            <div>
              <Label htmlFor="caseMedia" className="text-card-foreground">Загрузить новые медиа (заменят старые)</Label>
              <Input
                id="caseMedia"
                name="caseMediaInput"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaFileChange}
                className="mt-1 bg-background file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
               {replacingMedia && <p className="text-sm text-accent-foreground mt-2 p-2 bg-accent/20 rounded-md">Выбраны новые файлы. После сохранения они заменят все текущие медиа-файлы для модального окна.</p>}
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
              <Input id="tags" name="tags" type="text" defaultValue={caseToEdit.tags?.join(', ')} placeholder="tag1, tag2, tag3" className="mt-1 bg-background" />
            </div>

            <div>
              <Label htmlFor="externalUrl">Внешняя ссылка (URL, необязательно)</Label>
              <Input id="externalUrl" name="externalUrl" type="url" defaultValue={caseToEdit.externalUrl} className="mt-1 bg-background" />
            </div>
          </>
        )}
        
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
