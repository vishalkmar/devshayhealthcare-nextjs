import { getAdminFromCookies } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin' };

export default function AdminLayout({ children }) {
  const admin = getAdminFromCookies();
  // Login page (and any unauthenticated view) renders without the shell.
  if (!admin) return <div className="min-h-screen bg-cloud">{children}</div>;
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
