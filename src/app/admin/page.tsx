
import { getCases } from '@/app/admin/actions';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  // Authentication is handled by AdminLayout
  const cases = await getCases();

  return (
    <div>
      <AdminDashboardClient initialCases={cases} />
    </div>
  );
}

    