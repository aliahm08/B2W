import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { StatusPill } from '@/components/status-pill';
import { getDashboardSummary } from '@/lib/data/queries';

export default async function PortalDashboardPage() {
  const { counts, proposals, deliverables } = await getDashboardSummary();

  return (
    <div className="content-stack">
      <PageHeader
        eyebrow="Dashboard"
        title="Client portal"
        description="Monitor proposal activity, deliverables, and pending actions across the current workspace."
      />

      <section className="grid metrics">
        <div className="metric-card">
          <p className="eyebrow">Total proposals</p>
          <div className="metric-value">{counts.totalProposals}</div>
        </div>
        <div className="metric-card">
          <p className="eyebrow">Pending actions</p>
          <div className="metric-value">{counts.pendingApprovals}</div>
        </div>
        <div className="metric-card">
          <p className="eyebrow">Deliverables</p>
          <div className="metric-value">{counts.totalDeliverables}</div>
        </div>
        <div className="metric-card">
          <p className="eyebrow">Revision requests</p>
          <div className="metric-value">{counts.revisionRequests}</div>
        </div>
      </section>

      <div className="grid two">
        <section className="panel">
          <div className="split">
            <div>
              <p className="eyebrow">Recent proposals</p>
              <h2 style={{ margin: '10px 0 0', fontSize: 24 }}>Proposal review queue</h2>
            </div>
            <Link className="button-secondary" href="/portal/proposals">All proposals</Link>
          </div>
          <div className="comment-list" style={{ marginTop: 20 }}>
            {proposals.map((proposal) => (
              <Link className="comment-item" key={proposal.id} href={`/portal/proposals/${proposal.id}`}>
                <div className="split">
                  <strong>{proposal.title}</strong>
                  <StatusPill status={proposal.status} />
                </div>
                <p className="muted-copy">{proposal.summary ?? 'No summary provided.'}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="split">
            <div>
              <p className="eyebrow">Recent deliverables</p>
              <h2 style={{ margin: '10px 0 0', fontSize: 24 }}>Handoff center</h2>
            </div>
            <Link className="button-secondary" href="/portal/deliverables">All deliverables</Link>
          </div>
          <div className="comment-list" style={{ marginTop: 20 }}>
            {deliverables.map((deliverable) => (
              <Link className="comment-item" key={deliverable.id} href={`/portal/deliverables/${deliverable.id}`}>
                <div className="split">
                  <strong>{deliverable.title}</strong>
                  <span className="status-pill">{deliverable.version}</span>
                </div>
                <p className="muted-copy">{deliverable.description ?? 'No description provided.'}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
