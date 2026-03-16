import { PageHeader } from '@/components/page-header';
import { getAuditLog } from '@/lib/data/queries';

export default async function AuditPage() {
  const audit = await getAuditLog();

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Admin Audit"
        title="Audit history"
        description="Proposal, deliverable, comment, and invite events are recorded here for accountability."
      />

      <section className="table-shell">
        <table className="table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Entity</th>
              <th>Actor</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {audit.map((event) => (
              <tr key={event.id}>
                <td>{event.action}</td>
                <td>{event.entity_type} {event.entity_id ?? ''}</td>
                <td>{event.actor_profile_id ?? 'System'}</td>
                <td>{new Date(event.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
