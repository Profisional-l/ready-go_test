'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
    const pathname = usePathname();
    const isCases = pathname === '/admin' || pathname.startsWith('/admin/add-case') || pathname.startsWith('/admin/edit-case') || pathname.startsWith('/admin/cases');
    const isClients = pathname.startsWith('/admin/clients');

    return (
        <div className="flex gap-2 border-b">
            <Link
                href="/admin"
                className={`text-sm font-medium px-4 py-2 border-b-2 transition-colors ${isCases ? 'border-primary text-primary' : 'border-transparent hover:border-primary'
                    }`}
            >
                Кейсы
            </Link>
            <Link
                href="/admin/clients"
                className={`text-sm font-medium px-4 py-2 border-b-2 transition-colors ${isClients ? 'border-primary text-primary' : 'border-transparent hover:border-primary'
                    }`}
            >
                Логотипы компаний
            </Link>
        </div>
    );
}
