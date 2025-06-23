
import { getCases } from '@/app/admin/actions';
import AdminDashboardClient from './AdminDashboardClient';

export const revalidate = 0; // Отключить кеширование для этой страницы

export default async function AdminDashboardPage() {
  // Authentication is handled by AdminLayout
  const cases = await getCases();

  return (
    <div>
      <AdminDashboardClient initialCases={cases} />
    </div>
  );
}
