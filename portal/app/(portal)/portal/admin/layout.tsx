import { getAuthContext } from '@/lib/auth';
import { requireAdminOrTeam } from '@/lib/permissions';

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const context = await getAuthContext();
  requireAdminOrTeam(context);

  return <>{children}</>;
}
