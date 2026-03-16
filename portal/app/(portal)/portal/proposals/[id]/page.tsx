import { notFound } from 'next/navigation';
import { CommentThread } from '@/components/comment-thread';
import { PageHeader } from '@/components/page-header';
import { ProposalActions } from '@/components/proposal-actions';
import { StatusPill } from '@/components/status-pill';
import { UploadForm } from '@/components/upload-form';
import { getAuthContext } from '@/lib/auth';
import { canManagePortal } from '@/lib/permissions';
import { getProposalById } from '@/lib/data/queries';

export default async function ProposalDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await getAuthContext();
  const { proposal, attachments, comments } = await getProposalById(id);

  if (!proposal) {
    notFound();
  }

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Proposal Detail"
        title={proposal.title}
        description={proposal.summary ?? 'Proposal review workspace'}
        actions={<StatusPill status={proposal.status} />}
      />

      <div className="detail-grid">
        <div className="detail-stack">
          <section className="panel">
            <p className="eyebrow">Scope</p>
            <h2 style={{ marginTop: 10, fontSize: 24 }}>Commercial overview</h2>
            <div className="meta-list" style={{ marginTop: 20 }}>
              <div className="meta-row"><strong>Pricing</strong><span>{proposal.pricing ?? 'TBD'}</span></div>
              <div className="meta-row"><strong>Due date</strong><span>{proposal.due_date ? new Date(proposal.due_date).toLocaleDateString() : 'TBD'}</span></div>
              <div className="meta-row"><strong>Scope</strong><span style={{ maxWidth: 540, textAlign: 'right' }}>{proposal.scope ?? 'No scope provided.'}</span></div>
              <div className="meta-row"><strong>Assumptions</strong><span style={{ maxWidth: 540, textAlign: 'right' }}>{proposal.assumptions ?? 'No assumptions provided.'}</span></div>
              <div className="meta-row"><strong>Revision notes</strong><span style={{ maxWidth: 540, textAlign: 'right' }}>{proposal.revision_notes ?? 'None'}</span></div>
            </div>
          </section>

          <section className="panel">
            <div className="split">
              <div>
                <p className="eyebrow">Attachments</p>
                <h2 style={{ marginTop: 10, fontSize: 24 }}>Supporting files</h2>
              </div>
            </div>
            <div className="comment-list" style={{ marginTop: 20 }}>
              {attachments.length === 0 ? (
                <div className="empty-state">
                  <p className="muted-copy" style={{ margin: 0 }}>No proposal attachments yet.</p>
                </div>
              ) : (
                attachments.map((file) => (
                  <a
                    className="comment-item"
                    key={file.id}
                    href={`/api/files/download?bucket=portal-files&path=${encodeURIComponent(file.storage_path)}`}
                  >
                    <strong>{file.file_name}</strong>
                    <div className="muted-copy">{file.content_type ?? 'file'} • {file.file_size_bytes ?? 0} bytes</div>
                  </a>
                ))
              )}
            </div>
            {canManagePortal(context) ? (
              <div style={{ marginTop: 20 }}>
                <UploadForm action="/api/files/upload" entityId={proposal.id} organizationId={proposal.organization_id} label="proposal" />
              </div>
            ) : null}
          </section>

          <CommentThread comments={comments} organizationId={proposal.organization_id} proposalId={proposal.id} />
        </div>

        <div className="detail-stack">
          <ProposalActions context={context} proposal={proposal} />
        </div>
      </div>
    </div>
  );
}
