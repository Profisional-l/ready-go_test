
// This file is no longer used and can be deleted.
// The functionality has been moved to /admin/add-case and /admin for dashboard.
// Keeping it empty or redirecting can be an option if direct access is expected.
// For now, let's make it redirect to the new admin dashboard.

import { redirect } from 'next/navigation';

export default function OldAdminCasesPage() {
  redirect('/admin');
  // return null; // Or a message indicating the page has moved
}

    