import { PageHeader } from '@/components/page-header';
import { createDeliverableAction } from '@/lib/actions/deliverables';
import { getDeliverables, getOrganizations, getProposals } from '@/lib/data/queries';

export default async function AdminDeliverablesPage() {
  const [deliverables, organizations, proposals] = await Promise.all([
    getDeliverables(),
    getOrganizations(),
    getProposals()
  ]);

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Admin Deliverables"
        title="Manage deliverables"
        description="Publish new deliverables, link them to proposals, and manage version history."
      />

      <form action={createDeliverableAction} className="panel form-grid">
        <div className="field">
          <label htmlFor="organizationId">Organization</label>
          <select id="organizationId" name="organizationId" required>
            <option value="">Select organization</option>
            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>{organization.name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="proposalId">Linked proposal</label>
          <select id="proposalId" name="proposalId">
            <option value="">Standalone deliverable</option>
            {proposals.map((proposal) => (
              <option key={proposal.id} value={proposal.id}>{proposal.title}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" required />
        </div>
        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" />
        </div>
        <div className="field">
          <label htmlFor="version">Version</label>
          <input id="version" name="version" defaultValue="v1" />
        </div>
        <div className="button-row">
          <button className="button" type="submit">Create Deliverable</button>
        </div>
      </form>

      <section className="table-shell">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Version</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {deliverables.map((deliverable) => (
              <tr key={deliverable.id}>
                <td>{deliverable.title}</td>
                <td>{deliverable.version}</td>
                <td>{new Date(deliverable.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
