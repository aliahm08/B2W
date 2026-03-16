import { PageHeader } from '@/components/page-header';
import { getAuthContext } from '@/lib/auth';

export default async function SettingsPage() {
  const context = await getAuthContext();

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Settings"
        title="Access settings"
        description="Current role, organization context, and platform-level access information."
      />

      <section className="panel">
        <div className="meta-list">
          <div className="meta-row"><strong>Role</strong><span>{context.role}</span></div>
          <div className="meta-row"><strong>Clerk user</strong><span>{context.clerkUserId}</span></div>
          <div className="meta-row"><strong>Clerk organization</strong><span>{context.clerkOrgId ?? 'No active organization'}</span></div>
          <div className="meta-row"><strong>Database organization</strong><span>{context.organizationId ?? 'None mapped'}</span></div>
          <div className="meta-row"><strong>Email</strong><span>{context.email ?? 'Unavailable'}</span></div>
        </div>
      </section>
    </div>
  );
}
