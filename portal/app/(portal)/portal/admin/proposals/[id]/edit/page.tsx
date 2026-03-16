import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { getProposalById } from '@/lib/data/queries';
import { updateProposalAction } from '@/lib/actions/proposals';

export default async function EditProposalPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { proposal } = await getProposalById(id);

  if (!proposal) {
    notFound();
  }

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Admin Proposals"
        title={`Edit ${proposal.title}`}
        description="Update scope, pricing, status, due dates, and revision notes."
      />

      <form action={updateProposalAction.bind(null, proposal.id)} className="panel form-grid">
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" defaultValue={proposal.title} required />
        </div>
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={proposal.status}>
            <option value="draft">draft</option>
            <option value="sent">sent</option>
            <option value="viewed">viewed</option>
            <option value="approved">approved</option>
            <option value="revision_requested">revision_requested</option>
            <option value="closed">closed</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="summary">Summary</label>
          <textarea id="summary" name="summary" defaultValue={proposal.summary ?? ''} />
        </div>
        <div className="field">
          <label htmlFor="scope">Scope</label>
          <textarea id="scope" name="scope" defaultValue={proposal.scope ?? ''} />
        </div>
        <div className="field">
          <label htmlFor="pricing">Pricing</label>
          <textarea id="pricing" name="pricing" defaultValue={proposal.pricing ?? ''} />
        </div>
        <div className="field">
          <label htmlFor="assumptions">Assumptions</label>
          <textarea id="assumptions" name="assumptions" defaultValue={proposal.assumptions ?? ''} />
        </div>
        <div className="field">
          <label htmlFor="dueDate">Due date</label>
          <input id="dueDate" name="dueDate" type="date" defaultValue={proposal.due_date ?? ''} />
        </div>
        <div className="field">
          <label htmlFor="revisionNotes">Revision notes</label>
          <textarea id="revisionNotes" name="revisionNotes" defaultValue={proposal.revision_notes ?? ''} />
        </div>
        <div className="button-row">
          <button className="button" type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
