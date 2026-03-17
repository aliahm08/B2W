import { Link } from 'react-router-dom';

export default function ClientNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-xl font-medium tracking-tight">B2W</Link>

        {/* Desktop Title */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <span>Client Portal</span>
        </div>
      </div>
    </nav>
  );
}
