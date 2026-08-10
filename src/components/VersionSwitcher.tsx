import { Link, useLocation } from 'react-router-dom';

const versions = [
  { label: 'Live', to: '/' },
  { label: 'V1', to: '/v1' },
  { label: 'V2', to: '/v2' },
  { label: 'V3', to: '/v3' },
] as const;

export default function VersionSwitcher() {
  const { pathname } = useLocation();
  const activePath = pathname === '/' ? '/' : versions.find((version) => pathname === version.to || pathname.startsWith(`${version.to}/`))?.to;

  return (
    <nav aria-label="Website versions" className="fixed bottom-4 right-4 z-[80] flex items-center gap-1 rounded-full border border-black/15 bg-white/88 p-1.5 text-slate-950 shadow-[0_16px_50px_rgba(15,23,42,.18)] backdrop-blur-2xl">
      {versions.map((version) => (
        <Link
          key={version.to}
          to={version.to}
          aria-current={activePath === version.to ? 'page' : undefined}
          className={`rounded-full px-3 py-2 text-[11px] font-semibold transition ${activePath === version.to ? 'bg-slate-950 text-white' : 'hover:bg-black/5'}`}
        >
          {version.label}
        </Link>
      ))}
    </nav>
  );
}
