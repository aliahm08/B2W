import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { StatusPill } from '@/components/status-pill';
import { getProposals } from '@/lib/data/queries';

export default async function AdminProposalsPage() {
  const proposals = await getProposals();

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Admin Proposals"
        title="Manage proposals"
        description="Create new proposals, edit commercial terms, and maintain attachments and status."
        actions={<Link className="button" href="/portal/admin/proposals/new">New proposal</Link>}
      />

      <section className="table-shell">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal) => (
              <tr key={proposal.id}>
                <td>
                  <strong>{proposal.title}</strong>
                  <div className="muted-copy">{proposal.organization_id}</div>
                </td>
                <td><StatusPill status={proposal.status} /></td>
                <td>{new Date(proposal.updated_at).toLocaleString()}</td>
                <td><Link className="button-secondary" href={`/portal/admin/proposals/${proposal.id}/edit`}>Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
