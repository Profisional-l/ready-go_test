
'use client';

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addCaseAction } from '@/app/admin/actions'; // Updated path
import { useRouter } from "next/navigation";

export default function AddCaseForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const currentForm = event.currentTarget;

    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Нет файлов",
        description: "Пожалуйста, выберите хотя бы одно изображение.",
      });
      return;
    }
    setIsProcessing(true);

    const serverActionFormData = new FormData(currentForm);

    try {
      const result = await addCaseAction(serverActionFormData);

      if (result?.success) {
        toast({
          title: "Кейс добавлен!",
          description: `Кейс "${result.case?.title}" успешно добавлен.`,
        });
        router.push('/admin'); // Redirect to admin dashboard
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
          <Label htmlFor="caseImages" className="text-card-foreground">Изображения кейса</Label>
          <Input
            id="caseImages"
            name="caseImages"
            type="file"
            multiple
            onChange={handleFileChange}
            required
            className="mt-1 bg-background border-input text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {selectedFiles && selectedFiles.length > 0 && (
             <div className="mt-2 space-y-1">
                {Array.from(selectedFiles).map(file => (
                    <p key={file.name} className="text-sm text-muted-foreground">
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </p>
                ))}
             </div>
          )}
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

    