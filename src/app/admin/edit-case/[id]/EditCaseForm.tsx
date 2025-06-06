
'use client';

import type { Case } from "@/types";
import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateCaseAction } from '@/app/admin/actions';
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

interface EditCaseFormProps {
  caseToEdit: Case;
}

export default function EditCaseForm({ caseToEdit }: EditCaseFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const [title, setTitle] = useState(caseToEdit.title);
  const [category, setCategory] = useState(caseToEdit.category);
  const [description, setDescription] = useState(caseToEdit.description);
  const [fullDescription, setFullDescription] = useState(caseToEdit.fullDescription);
  const [tags, setTags] = useState(caseToEdit.tags.join(', '));
  const [currentImageUrls, setCurrentImageUrls] = useState<string[]>(caseToEdit.imageUrls);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
      // Preview new files by converting them to data URLs (optional, for better UX)
      const newImagePreviewUrls = Array.from(event.target.files).map(file => URL.createObjectURL(file));
      setCurrentImageUrls(newImagePreviewUrls); // Replace current images with previews of new ones
    }
  };
  
  // Clean up object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
        currentImageUrls.forEach(url => {
            if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        });
    };
  }, [currentImageUrls]);


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);

    const serverActionFormData = new FormData(event.currentTarget);
    // If no new files are selected, we don't want to send an empty 'caseImages' entry
    // The server action will check if 'caseImages' has actual files.
    // FormData automatically handles the 'caseImages' input. If files are selected, they are included.
    // If no files selected for an input type="file", it won't be part of formData unless handled explicitly.

    try {
      const result = await updateCaseAction(caseToEdit.id, serverActionFormData);

      if (result?.success) {
        toast({
          title: "Кейс обновлен!",
          description: `Кейс "${result.case?.title}" успешно обновлен.`,
        });
        router.push('/admin');
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
      <h1 className="text-3xl font-bold mb-8 text-foreground">Редактировать кейс: {caseToEdit.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-md">
        <div>
          <Label htmlFor="title" className="text-card-foreground">Название</Label>
          <Input id="title" name="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 bg-background" />
        </div>

        <div>
          <Label htmlFor="category" className="text-card-foreground">Категория</Label>
          <Input id="category" name="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 bg-background" />
        </div>
        
        <div>
          <Label className="text-card-foreground">Текущие изображения</Label>
            {currentImageUrls.length > 0 ? (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {currentImageUrls.map((url, index) => (
                  <div key={index} className="relative aspect-video">
                    <Image src={url.startsWith('blob:') ? url : url} alt={`Current image ${index + 1}`} layout="fill" objectFit="cover" className="rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">Нет текущих изображений.</p>
            )}
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
           {selectedFiles && selectedFiles.length > 0 && (
             <div className="mt-2 space-y-1">
                <p className="text-sm text-accent">Выбраны новые файлы:</p>
                {Array.from(selectedFiles).map(file => (
                    <p key={file.name} className="text-sm text-muted-foreground">
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </p>
                ))}
             </div>
          )}
        </div>

        <div>
          <Label htmlFor="description" className="text-card-foreground">Краткое описание</Label>
          <Textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="mt-1 bg-background" />
        </div>

        <div>
          <Label htmlFor="fullDescription" className="text-card-foreground">Полное описание</Label>
          <Textarea id="fullDescription" name="fullDescription" value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} required rows={6} className="mt-1 bg-background" />
        </div>

        <div>
          <Label htmlFor="tags" className="text-card-foreground">Теги (через запятую)</Label>
          <Input id="tags" name="tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tag1, tag2, tag3" className="mt-1 bg-background" />
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

    