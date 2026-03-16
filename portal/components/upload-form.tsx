export function UploadForm({
  action,
  entityId,
  organizationId,
  label
}: {
  action: string;
  entityId: string;
  organizationId: string;
  label: 'proposal' | 'deliverable';
}) {
  return (
    <form action={action} method="post" encType="multipart/form-data" className="form-grid">
      <input type="hidden" name="entityId" value={entityId} />
      <input type="hidden" name="organizationId" value={organizationId} />
      <input type="hidden" name="entityType" value={label} />
      <div className="field">
        <label htmlFor={`file-${label}`}>Upload file</label>
        <input id={`file-${label}`} name="file" type="file" required />
      </div>
      <div className="button-row">
        <button className="button-secondary" type="submit">
          Upload to Storage
        </button>
      </div>
    </form>
  );
}
