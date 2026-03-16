import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type PreviewReturnBarProps = {
  returnPath: string;
  label: string;
  detail: string;
};

export default function PreviewReturnBar({
  returnPath,
  label,
  detail,
}: PreviewReturnBarProps) {
  return (
    <div className="fixed inset-x-0 top-20 z-40 px-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border border-neutral-900 bg-white/95 px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">{label}</p>
          <p className="mt-1 text-sm text-neutral-700">{detail}</p>
        </div>
        <Link
          to={returnPath}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-black transition-colors hover:border-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Proposal
        </Link>
      </div>
    </div>
  );
}
