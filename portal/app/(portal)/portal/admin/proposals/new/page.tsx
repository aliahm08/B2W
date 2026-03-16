import { PageHeader } from '@/components/page-header';
import { createProposalAction } from '@/lib/actions/proposals';
import { getOrganizations } from '@/lib/data/queries';

export default async function NewProposalPage() {
  const organizations = await getOrganizations();

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Admin Proposals"
        title="Create proposal"
        description="Draft a new proposal and assign it to a client organization."
      />

      <form action={createProposalAction} className="panel form-grid">
        <div className="field">
          <label htmlFor="organizationId">Organization</label>
          <select id="organizationId" name="organizationId" required>
            <option value="">Select organization</option>
            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" required />
        </div>
        <div className="field">
          <label htmlFor="summary">Summary</label>
          <textarea id="summary" name="summary" />
        </div>
        <div className="field">
          <label htmlFor="scope">Scope</label>
          <textarea id="scope" name="scope" />
        </div>
        <div className="field">
          <label htmlFor="pricing">Pricing</label>
          <textarea id="pricing" name="pricing" />
        </div>
        <div className="field">
          <label htmlFor="assumptions">Assumptions</label>
          <textarea id="assumptions" name="assumptions" />
        </div>
        <div className="field">
          <label htmlFor="dueDate">Due date</label>
          <input id="dueDate" name="dueDate" type="date" />
        </div>
        <div className="button-row">
          <button className="button" type="submit">Create Proposal</button>
        </div>
      </form>
    </div>
  );
}
