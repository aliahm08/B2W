import { PageHeader } from '@/components/page-header';
import { getOrganizations } from '@/lib/data/queries';

export default async function AdminClientsPage() {
  const organizations = await getOrganizations();

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Admin Clients"
        title="Client organizations"
        description="Every proposal, deliverable, comment, and file is scoped to one client organization."
      />

      <section className="table-shell">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Clerk org</th>
              <th>Primary contact</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((organization) => (
              <tr key={organization.id}>
                <td>{organization.name}</td>
                <td>{organization.slug}</td>
                <td>{organization.clerk_org_id ?? 'Not linked'}</td>
                <td>{organization.primary_contact_email ?? 'Not set'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
