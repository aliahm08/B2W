import { acknowledgeProposalAction, approveProposalAction, requestRevisionAction } from '@/lib/actions/proposals';
import { canApproveProposal } from '@/lib/permissions';
import type { AuthContext, ProposalRecord } from '@/lib/types';

export function ProposalActions({
  context,
  proposal
}: {
  context: AuthContext;
  proposal: ProposalRecord;
}) {
  const canApprove = canApproveProposal(context);

  return (
    <section className="panel">
      <p className="eyebrow">Response Actions</p>
      <h2 style={{ margin: '10px 0 0', fontSize: 24 }}>Client response</h2>
      <p className="muted-copy" style={{ marginTop: 12 }}>
        Editors can approve the proposal or request revisions. Viewers can acknowledge receipt and follow the discussion.
      </p>

      <div className="button-row" style={{ marginTop: 20 }}>
        <form action={acknowledgeProposalAction.bind(null, proposal.id)}>
          <button className="button-secondary" type="submit">
            Acknowledge Receipt
          </button>
        </form>

        {canApprove ? (
          <form action={approveProposalAction.bind(null, proposal.id)}>
            <button className="button" type="submit">
              Approve Proposal
            </button>
          </form>
        ) : null}
      </div>

      {canApprove ? (
        <form action={requestRevisionAction.bind(null, proposal.id)} className="form-grid" style={{ marginTop: 20 }}>
          <div className="field">
            <label htmlFor="revisionNotes">Revision notes</label>
            <textarea id="revisionNotes" name="revisionNotes" placeholder="Describe what needs to change before approval." />
          </div>
          <div className="button-row">
            <button className="button-danger" type="submit">
              Request Revision
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
