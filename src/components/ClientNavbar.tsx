import { Link } from 'react-router-dom';

export default function ClientNavbar({ clientName }: { clientName?: string }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-medium tracking-tight">B2W</Link>
          {clientName && (
            <>
              <span className="text-neutral-300">/</span>
              <span className="text-sm font-medium tracking-tight text-neutral-600">{clientName}</span>
            </>
          )}
        </div>

        {/* Desktop Title */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <span>Client Portal</span>
        </div>
      </div>
    </nav>
  );
}
