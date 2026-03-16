import { PortalShell } from '@/components/portal-shell';

export default async function PortalLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <PortalShell pathname="/portal">{children}</PortalShell>;
}
