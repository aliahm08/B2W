import Link from 'next/link';
import { PageHeader } from '@/components/page-header';

const sections = [
  { href: '/portal/admin/proposals', label: 'Manage proposals', description: 'Create, edit, and track proposal lifecycle.' },
  { href: '/portal/admin/deliverables', label: 'Manage deliverables', description: 'Upload work products and maintain versions.' },
  { href: '/portal/admin/clients', label: 'Client records', description: 'Map organizations, contacts, and workspace ownership.' },
  { href: '/portal/admin/invites', label: 'Invites', description: 'Invite client users and assign viewer/editor access.' },
  { href: '/portal/admin/audit', label: 'Audit history', description: 'Review who changed what and when.' }
];

export default function AdminOverviewPage() {
  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Admin"
        title="Operations workspace"
        description="Internal management tools for proposals, deliverables, clients, invitations, and audit history."
      />

      <section className="grid two">
        {sections.map((section) => (
          <Link className="panel" href={section.href} key={section.href}>
            <p className="eyebrow">Internal tool</p>
            <h2 style={{ margin: '10px 0 0', fontSize: 24 }}>{section.label}</h2>
            <p className="muted-copy">{section.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
