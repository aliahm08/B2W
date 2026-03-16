import { notFound } from 'next/navigation';
import { CommentThread } from '@/components/comment-thread';
import { PageHeader } from '@/components/page-header';
import { UploadForm } from '@/components/upload-form';
import { getAuthContext } from '@/lib/auth';
import { canManagePortal } from '@/lib/permissions';
import { getDeliverableById } from '@/lib/data/queries';

export default async function DeliverableDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await getAuthContext();
  const { deliverable, files, comments } = await getDeliverableById(id);

  if (!deliverable) {
    notFound();
  }

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Deliverable Detail"
        title={deliverable.title}
        description={deliverable.description ?? 'Deliverable detail workspace'}
      />

      <div className="detail-grid">
        <div className="detail-stack">
          <section className="panel">
            <p className="eyebrow">Version</p>
            <h2 style={{ marginTop: 10, fontSize: 24 }}>{deliverable.version}</h2>
            <div className="meta-list" style={{ marginTop: 20 }}>
              <div className="meta-row"><strong>Linked proposal</strong><span>{deliverable.proposal_id ?? 'Standalone deliverable'}</span></div>
              <div className="meta-row"><strong>Uploaded</strong><span>{new Date(deliverable.created_at).toLocaleString()}</span></div>
              <div className="meta-row"><strong>Last updated</strong><span>{new Date(deliverable.updated_at).toLocaleString()}</span></div>
            </div>
          </section>

          <section className="panel">
            <div className="split">
              <div>
                <p className="eyebrow">Files</p>
                <h2 style={{ marginTop: 10, fontSize: 24 }}>Download package</h2>
              </div>
            </div>
            <div className="comment-list" style={{ marginTop: 20 }}>
              {files.length === 0 ? (
                <div className="empty-state">
                  <p className="muted-copy" style={{ margin: 0 }}>No files uploaded yet.</p>
                </div>
              ) : (
                files.map((file) => (
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
                <UploadForm action="/api/files/upload" entityId={deliverable.id} organizationId={deliverable.organization_id} label="deliverable" />
              </div>
            ) : null}
          </section>

          <CommentThread comments={comments} organizationId={deliverable.organization_id} deliverableId={deliverable.id} />
        </div>
      </div>
    </div>
  );
}
