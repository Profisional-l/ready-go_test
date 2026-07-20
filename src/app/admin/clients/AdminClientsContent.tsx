'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { deleteClientAction, addClientAction, updateClientsOrderAction } from '@/app/admin/actions';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Upload, X } from 'lucide-react';

interface Client {
    id: string;
    name: string;
    src: string;
    order: number;
}

interface AdminClientsContentProps {
    initialClients: Client[];
}

export default function AdminClientsContent({ initialClients }: AdminClientsContentProps) {
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [isAdding, setIsAdding] = useState(false);
    const [newClientName, setNewClientName] = useState('');
    const [newClientImage, setNewClientImage] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSavingOrder, setIsSavingOrder] = useState(false);
    const [availableImages, setAvailableImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const router = useRouter();

    // Load available company logos
    useEffect(() => {
        const logos = [
            '/images/companies/cocacola.svg',
            '/images/companies/kfc.svg',
            '/images/companies/mtbank.svg',
            '/images/companies/ararat.svg',
            '/images/companies/nivea.svg',
            '/images/companies/bonaqua.svg',
            '/images/companies/sportmaster.svg',
            '/images/companies/aps.svg',
            '/images/companies/glenlivent.svg',
        ];
        setAvailableImages(logos);
    }, []);

    useEffect(() => {
        setClients(initialClients);
    }, [initialClients]);

    const isOrderChanged = useMemo(() => {
        if (initialClients.length !== clients.length) return true;
        for (let i = 0; i < initialClients.length; i++) {
            if (initialClients[i].id !== clients[i].id) return true;
        }
        return false;
    }, [initialClients, clients]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Поддерживаются только SVG, PNG, JPEG и WEBP.' });
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Размер файла не должен превышать 2MB.' });
            return;
        }

        setUploadedFile(file);
        setNewClientImage(''); // Clear dropdown selection

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSelectFromDropdown = (imagePath: string) => {
        setNewClientImage(imagePath);
        setUploadedFile(null);
        setPreviewUrl('');
    };

    const handleClearUpload = () => {
        setUploadedFile(null);
        setPreviewUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAddClient = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newClientName.trim()) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Введите название компании.' });
            return;
        }

        if (!uploadedFile && !newClientImage) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Загрузите или выберите изображение логотипа.' });
            return;
        }

        setIsAdding(true);
        const formData = new FormData();
        formData.append('name', newClientName);

        if (uploadedFile) {
            formData.append('logoImage', uploadedFile);
        } else {
            formData.append('imagePath', newClientImage);
        }

        const result = await addClientAction(formData);
        if (result.success && result.client) {
            setClients([...clients, result.client].sort((a, b) => a.order - b.order));
            setNewClientName('');
            setNewClientImage('');
            setUploadedFile(null);
            setPreviewUrl('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            toast({ title: 'Успех', description: 'Логотип успешно добавлен.' });
            router.refresh();
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: result.error || 'Не удалось добавить логотип.' });
        }
        setIsAdding(false);
    };

    const handleDeleteClient = async (clientId: string) => {
        setIsDeleting(true);
        const result = await deleteClientAction(clientId);
        if (result.success) {
            setClients(prevClients => prevClients.filter(c => c.id !== clientId));
            toast({ title: 'Успех', description: 'Логотип успешно удален.' });
            router.refresh();
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: result.error || 'Не удалось удалить логотип.' });
        }
        setIsDeleting(false);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newClients = [...clients];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newClients[index], newClients[targetIndex]] = [newClients[targetIndex], newClients[index]];
        setClients(newClients);
    };

    const handleSaveOrder = async () => {
        setIsSavingOrder(true);
        const result = await updateClientsOrderAction(clients);
        if (result.success) {
            toast({ title: 'Успех', description: 'Порядок логотипов сохранен.' });
            router.refresh();
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: result.error || 'Не удалось сохранить порядок.' });
        }
        setIsSavingOrder(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Логотипы компаний</h1>
                <div className="flex items-center space-x-2">
                    {isOrderChanged && (
                        <Button onClick={handleSaveOrder} disabled={isSavingOrder}>
                            <Save className="mr-2 h-5 w-5" />
                            {isSavingOrder ? 'Сохранение...' : 'Сохранить порядок'}
                        </Button>
                    )}
                </div>
            </div>

            {/* Add New Client Form */}
            <div className="border rounded-lg p-6 bg-slate-50">
                <h2 className="text-xl font-semibold mb-4">Добавить новый логотип</h2>
                <form onSubmit={handleAddClient} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Название компании *</label>
                            <Input
                                type="text"
                                placeholder="e.g., Coca-Cola"
                                value={newClientName}
                                onChange={(e) => setNewClientName(e.target.value)}
                                disabled={isAdding}
                            />
                        </div>

                        {/* Upload File Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Загружаемый файл (SVG, PNG, JPEG, WEBP)</label>
                            <div className="flex gap-2">
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/svg+xml,image/png,image/jpeg,image/webp"
                                    onChange={handleFileChange}
                                    disabled={isAdding}
                                    className="flex-1"
                                />
                                {uploadedFile && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClearUpload}
                                        disabled={isAdding}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Максимум 2MB</p>
                        </div>
                    </div>

                    {/* Or Divider */}
                    {(uploadedFile || newClientImage) && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="flex-1 border-t"></div>
                            <span>или</span>
                            <div className="flex-1 border-t"></div>
                        </div>
                    )}

                    {/* Select from existing */}
                    {!uploadedFile && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Выбрать из существующих логотипов</label>
                            <select
                                value={newClientImage}
                                onChange={(e) => handleSelectFromDropdown(e.target.value)}
                                disabled={isAdding}
                                className="w-full border rounded px-3 py-2 text-sm"
                            >
                                <option value="">-- Выберите логотип --</option>
                                {availableImages.map((img) => {
                                    const name = img.split('/').pop()?.replace('.svg', '') || img;
                                    const isUsed = clients.some(c => c.src === img);
                                    return (
                                        <option key={img} value={img} disabled={isUsed}>
                                            {name} {isUsed ? '(используется)' : ''}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    )}

                    {/* Preview */}
                    {(previewUrl || newClientImage) && (
                        <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Предпросмотр:</p>
                            <div className="flex items-center justify-center p-4 border rounded bg-white">
                                <div style={{ position: 'relative', width: 120, height: 120 }}>
                                    <Image
                                        src={previewUrl || newClientImage}
                                        alt="Preview"
                                        fill
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isAdding || !newClientName.trim() || (!uploadedFile && !newClientImage)}
                        className="w-full"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {isAdding ? 'Добавление...' : 'Добавить логотип'}
                    </Button>
                </form>
            </div>

            {/* Clients Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">№</TableHead>
                            <TableHead className="w-20">Логотип</TableHead>
                            <TableHead>Название</TableHead>
                            <TableHead className="w-24">Порядок</TableHead>
                            <TableHead className="w-20 text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    Логотипы не найдены
                                </TableCell>
                            </TableRow>
                        ) : (
                            clients.map((client, index) => (
                                <TableRow key={client.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        <div style={{ position: 'relative', width: 60, height: 60 }}>
                                            <Image
                                                src={client.src}
                                                alt={client.name}
                                                fill
                                                style={{ objectFit: 'contain' }}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{client.name}</TableCell>
                                    <TableCell>
                                        <div className="flex w-fit gap-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleMove(index, 'up')}
                                                disabled={index === 0}
                                            >
                                                <ArrowUp className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleMove(index, 'down')}
                                                disabled={index === clients.length - 1}
                                            >
                                                <ArrowDown className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    disabled={isDeleting}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Удалить логотип?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Вы уверены, что хотите удалить логотип "{client.name}"? Это действие нельзя отменить.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteClient(client.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Удалить
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
