import { getClients } from '@/app/admin/actions';
import AdminClientsContent from './AdminClientsContent';

export const revalidate = 0;

export default async function AdminClientsPage() {
    const clients = await getClients();

    return (
        <div>
            <AdminClientsContent initialClients={clients} />
        </div>
    );
}
