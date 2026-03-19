import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { getAuthContext } from '@/lib/auth';
import { canManagePortal } from '@/lib/permissions';

const baseLinks = [
  { href: '/portal', label: 'Dashboard' },
  { href: '/portal/proposals', label: 'Proposals' },
  { href: '/portal/deliverables', label: 'Deliverables' },
  { href: '/portal/settings', label: 'Settings' }
];

const adminLinks = [
  { href: '/portal/admin', label: 'Admin Overview' },
  { href: '/portal/admin/proposals', label: 'Manage Proposals' },
  { href: '/portal/admin/deliverables', label: 'Manage Deliverables' },
  { href: '/portal/admin/clients', label: 'Clients' },
  { href: '/portal/admin/invites', label: 'Invites' },
  { href: '/portal/admin/audit', label: 'Audit' }
];

export async function PortalShell({
  pathname,
  children
}: {
  pathname: string;
  children: React.ReactNode;
}) {
  const context = await getAuthContext();
  const showAdmin = canManagePortal(context);

  return (
    <div className="app-shell">
      <div className="portal-layout">
        <aside className="sidebar">
          <p className="eyebrow"><span className="b2w-wordmark">B2W</span> Portal</p>
          <h2 style={{ marginTop: 10, marginBottom: 0, fontSize: 28, letterSpacing: '-0.04em' }}>Client Workspace</h2>
          <p className="muted-copy" style={{ marginTop: 12 }}>
            {context.isInternal ? 'Internal operations and client management' : 'Your proposals, deliverables, and collaboration history'}
          </p>

          <nav>
            {baseLinks.map((link) => (
              <Link
                key={link.href}
                className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {showAdmin ? (
            <>
              <p className="eyebrow" style={{ marginTop: 28 }}>Internal</p>
              <nav>
                {adminLinks.map((link) => (
                  <Link
                    key={link.href}
                    className={`sidebar-link ${pathname.startsWith(link.href) ? 'active' : ''}`}
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </>
          ) : null}

          <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
            <p className="eyebrow">Signed In</p>
            <div className="split" style={{ marginTop: 12 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{context.email ?? 'Portal user'}</div>
                <div className="muted-copy" style={{ fontSize: 14 }}>{context.role}</div>
              </div>
              {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
                <UserButton afterSignOutUrl="/sign-in" />
              ) : (
                <span className="muted-copy" style={{ fontSize: 14 }}>Clerk disabled</span>
              )}
            </div>
          </div>
        </aside>

        <main className="content">
          <div className="container">{children}</div>
        </main>
      </div>
    </div>
  );
}
