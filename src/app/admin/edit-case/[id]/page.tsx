
import { getCase } from '@/app/admin/actions';
import EditCaseForm from './EditCaseForm';
import { notFound } from 'next/navigation';

interface EditCasePageProps {
  params: { id: string };
}

export default async function EditCasePage({ params }: EditCasePageProps) {
  // Authentication is handled by AdminLayout
  const caseData = await getCase(params.id);

  if (!caseData) {
    notFound(); // Or redirect to admin dashboard with an error
  }

  return (
    <div>
      <EditCaseForm caseToEdit={caseData} />
    </div>
  );
}

    