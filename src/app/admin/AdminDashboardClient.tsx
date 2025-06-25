
'use client';

import type { Case } from '@/types';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteCaseAction } from '@/app/admin/actions';
import { useRouter } from 'next/navigation';
import { PlusCircle, Edit, Trash2, ImageIcon } from 'lucide-react';

interface AdminDashboardClientProps {
  initialCases: Case[];
}

export default function AdminDashboardClient({ initialCases }: AdminDashboardClientProps) {
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async (caseId: string) => {
    setIsDeleting(true);
    const result = await deleteCaseAction(caseId);
    if (result.success) {
      setCases(prevCases => prevCases.filter(c => c.id !== caseId));
      toast({ title: 'Успех', description: 'Кейс успешно удален.' });
      router.refresh(); 
    } else {
      toast({ variant: 'destructive', title: 'Ошибка', description: result.error || 'Не удалось удалить кейс.' });
    }
    setIsDeleting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Кейсы</h1>
        <Button asChild>
          <Link href="/admin/add-case">
            <PlusCircle className="mr-2 h-5 w-5" /> Добавить новый кейс
          </Link>
        </Button>
      </div>

      {cases.length === 0 ? (
        <p className="text-muted-foreground">Пока нет ни одного кейса. Нажмите "Добавить новый кейс", чтобы начать.</p>
      ) : (
        <div className="bg-card p-6 rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Обложка</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell>
                    {caseItem.coverUrl ? (
                      <Image
                        src={caseItem.coverUrl}
                        alt="Обложка"
                        width={60}
                        height={40}
                        unoptimized
                        className="rounded object-cover"
                        data-ai-hint="case cover"
                      />
                    ) : (
                       <div className="w-[60px] h-[40px] flex items-center justify-center bg-muted rounded">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                       </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{caseItem.title}</TableCell>
                  <TableCell>{caseItem.category}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/edit-case/${caseItem.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Редактировать</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={isDeleting}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Удалить</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Это действие нельзя будет отменить. Кейс "{caseItem.title}" будет удален навсегда.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(caseItem.id)}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            {isDeleting ? 'Удаление...' : 'Удалить'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
