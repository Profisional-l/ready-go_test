
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { verifyPasswordAction } from '@/app/admin/cases/actions'; // Adjust path as needed

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('password', password);

    const result = await verifyPasswordAction(formData);

    if (result.success) {
      toast({
        title: 'Успех!',
        description: 'Вы вошли в систему.',
      });
      router.refresh(); // Refresh the page to trigger server component re-render
    } else {
      setError(result.error || 'Произошла неизвестная ошибка.');
      toast({
        variant: 'destructive',
        title: 'Ошибка входа',
        description: result.error || 'Неверный пароль или серверная ошибка.',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card shadow-xl rounded-lg">
        <h1 className="text-2xl font-bold text-center text-card-foreground">Вход в панель администратора</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  );
}
