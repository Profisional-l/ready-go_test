import { getClients } from '@/app/admin/actions';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const clients = await getClients();
        return NextResponse.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        return NextResponse.json(
            { error: 'Failed to fetch clients' },
            { status: 500 }
        );
    }
}
