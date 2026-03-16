import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { getDeliverables } from '@/lib/data/queries';

export default async function DeliverablesPage() {
  const deliverables = await getDeliverables();

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Deliverables"
        title="Deliverable handoff center"
        description="Track versions, linked proposals, uploaded files, and discussion history for final work products."
      />

      <section className="table-shell">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Version</th>
              <th>Proposal</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {deliverables.map((deliverable) => (
              <tr key={deliverable.id}>
                <td>
                  <Link href={`/portal/deliverables/${deliverable.id}`}>
                    <strong>{deliverable.title}</strong>
                    <div className="muted-copy">{deliverable.description ?? 'No description provided.'}</div>
                  </Link>
                </td>
                <td>{deliverable.version}</td>
                <td>{deliverable.proposal_id ?? 'Standalone'}</td>
                <td>{new Date(deliverable.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
