import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { StatusPill } from '@/components/status-pill';
import { getProposals } from '@/lib/data/queries';

export default async function ProposalsPage() {
  const proposals = await getProposals();

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Proposals"
        title="Proposal workspace"
        description="Review scope, pricing, due dates, revision history, and response status for each active proposal."
      />

      <section className="table-shell">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Due date</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal) => (
              <tr key={proposal.id}>
                <td>
                  <Link href={`/portal/proposals/${proposal.id}`}>
                    <strong>{proposal.title}</strong>
                    <div className="muted-copy">{proposal.summary ?? 'No summary provided.'}</div>
                  </Link>
                </td>
                <td><StatusPill status={proposal.status} /></td>
                <td>{proposal.due_date ? new Date(proposal.due_date).toLocaleDateString() : 'TBD'}</td>
                <td>{new Date(proposal.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
