
import type { PropsWithChildren } from 'react';
import { isAuthenticated } from '@/app/admin/actions';
import LoginForm from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button'; // For logout button if needed in layout
import { logoutAction } from '@/app/admin/actions'; // For logout button
import Link from 'next/link';


export default async function AdminLayout({ children }: PropsWithChildren) {
  const authed = await isAuthenticated();

  if (!authed) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-card shadow-sm">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link href="/admin" className="text-xl font-semibold text-foreground">
            Панель Администратора
          </Link>
          <form action={logoutAction}>
            <Button type="submit" variant="outline">Выйти</Button>
          </form>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {children}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} READYGO Admin
      </footer>
    </div>
  );
}

    