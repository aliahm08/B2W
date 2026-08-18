import { Link, useLocation } from 'react-router-dom';

const versions = [
  { label: 'Live', to: '/' },
  { label: 'V1', to: '/v1' },
  { label: 'V2', to: '/v2' },
  { label: 'V3', to: '/v3' },
  { label: 'V4', to: '/v4' },
  { label: 'V5', to: '/v5' },
] as const;

export default function VersionSwitcher() {
  const { pathname } = useLocation();
  const activePath = pathname === '/' ? '/' : versions.find((version) => pathname === version.to || pathname.startsWith(`${version.to}/`))?.to;

  return (
    <nav aria-label="Website versions" className="fixed bottom-3 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-black/15 bg-white/92 p-1 text-slate-950 shadow-[0_16px_50px_rgba(15,23,42,.18)] backdrop-blur-2xl sm:bottom-4 sm:left-auto sm:right-4 sm:translate-x-0 sm:gap-1 sm:p-1.5">
      {versions.map((version) => (
        <Link
          key={version.to}
          to={version.to}
          aria-current={activePath === version.to ? 'page' : undefined}
          className={`rounded-full px-2.5 py-2 text-[10px] font-semibold transition sm:px-3 sm:text-[11px] ${activePath === version.to ? 'bg-slate-950 text-white' : 'hover:bg-black/5'}`}
        >
          {version.label}
        </Link>
      ))}
    </nav>
  );
}
