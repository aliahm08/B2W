import { PageHeader } from '@/components/page-header';
import { inviteClientUserAction } from '@/lib/actions/invites';
import { getOrganizations } from '@/lib/data/queries';

export default async function AdminInvitesPage() {
  const organizations = await getOrganizations();

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Admin Invites"
        title="Invite client users"
        description="Invite client viewers and editors into the correct Clerk organization so access remains tenant-scoped."
      />

      <form action={inviteClientUserAction} className="panel form-grid">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="role">Role</label>
          <select id="role" name="role" defaultValue="client_viewer">
            <option value="client_viewer">client_viewer</option>
            <option value="client_editor">client_editor</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="clerkOrgId">Clerk organization</label>
          <select id="clerkOrgId" name="clerkOrgId" required>
            <option value="">Select organization</option>
            {organizations.map((organization) => (
              <option key={organization.id} value={organization.clerk_org_id ?? ''}>
                {organization.name} {organization.clerk_org_id ? '' : '(missing Clerk org id)'}
              </option>
            ))}
          </select>
        </div>
        <div className="button-row">
          <button className="button" type="submit">Send Invite</button>
        </div>
      </form>
    </div>
  );
}
