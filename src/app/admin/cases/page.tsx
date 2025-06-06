
import { cookies } from 'next/headers';
import LoginForm from '@/components/auth/LoginForm';
import AdminCasesContent from './AdminCasesContent';

export default function AdminCasesPageContainer() {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get('admin-auth-readygo-cases')?.value === 'true';

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <AdminCasesContent />;
}
