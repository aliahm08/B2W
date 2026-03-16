import type { ProposalStatus } from '@/lib/types';

export function StatusPill({ status }: { status: ProposalStatus | string }) {
  return <span className={`status-pill ${status}`}>{status.replace(/_/g, ' ')}</span>;
}
