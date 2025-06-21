
'use client';

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addCaseAction } from '@/app/admin/actions';
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, X } from "lucide-react";

// MediaPreview component to render image or video
const MediaPreview = ({ file }: { file: File }) => {
  const isVideo = file.type.startsWith('video');
  const url = URL.createObjectURL(file);

  return (
    <div className="relative w-10 h-10">
      {isVideo ? (
        <video src={url} className="w-full h-full object-cover rounded" />
      ) : (
        <Image
          src={url}
          alt={file.name}
          width={40}
          height={40}
          className="rounded object-cover"
        />
      )}
    </div>
  );
};

export default function AddCaseForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(event.target.files!)]);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === files.length - 1) return;

    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      // Swap elements
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      return newFiles;
    });
  };
  
  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (files.length === 0) {
      toast({
        variant: "destructive",
        title: "Нет файлов",
        description: "Пожалуйста, выберите хотя бы один медиа-файл.",
      });
      return;
    }
    setIsProcessing(true);

    const serverActionFormData = new FormData(event.currentTarget);

    files.forEach(file => {
      serverActionFormData.append('caseMedia', file);
    });

    try {
      const result = await addCaseAction(serverActionFormData);

      if (result?.success) {
        toast({
          title: "Кейс добавлен!",
          description: `Кейс "${result.case?.title}" успешно добавлен.`,
        });
        router.push('/admin');
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка добавления",
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
      <h1 className="text-3xl font-bold mb-8 text-foreground">Добавить новый кейс</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-md">
        <div>
          <Label htmlFor="title" className="text-card-foreground">Название</Label>
          <Input id="title" name="title" type="text" required className="mt-1 bg-background border-input text-foreground" />
        </div>

        <div>
          <Label htmlFor="category" className="text-card-foreground">Категория</Label>
          <Input id="category" name="category" type="text" required className="mt-1 bg-background border-input text-foreground" />
        </div>

        <div>
          <Label htmlFor="caseMedia" className="text-card-foreground">Медиа-файлы (Изображения и Видео)</Label>
          <Input
            id="caseMedia"
            name="caseMediaInput"
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="mt-1 bg-background border-input text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
        </div>

        {files.length > 0 && (
            <div>
                <Label>Порядок медиа</Label>
                <p className="text-sm text-muted-foreground">Первый элемент будет обложкой кейса. Используйте стрелки для сортировки.</p>
                <div className="mt-2 space-y-2 rounded-lg border p-2">
                    {files.map((file, index) => (
                        <div
                            key={`${file.name}-${file.lastModified}-${index}`}
                            className="flex items-center p-2 bg-muted rounded-md"
                        >
                            <MediaPreview file={file} />
                            <p className="ml-4 text-sm text-foreground truncate flex-grow">{file.name}</p>
                            <div className="flex items-center ml-auto pl-4">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMove(index, 'up')}
                                disabled={index === 0}
                                aria-label="Move up"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMove(index, 'down')}
                                disabled={index === files.length - 1}
                                aria-label="Move down"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveFile(index)}
                                aria-label="Remove"
                                className="ml-2"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
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
        
        <div className="flex space-x-2">
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isProcessing}>
              {isProcessing ? 'Обработка...' : 'Добавить кейс'}
            </Button>
             <Button type="button" variant="outline" onClick={() => router.push('/admin')}>
              Отмена
            </Button>
        </div>
      </form>
    </div>
  );
}
