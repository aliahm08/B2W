import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export type ClientNavAction = {
  label: string;
  onClick?: () => void;
  to?: string;
  type?: 'link' | 'button' | 'cta';
  items?: ClientNavAction[]; // For dropdowns
};

export default function ClientNavbar({ 
  clientName, 
  navItems 
}: { 
  clientName?: string;
  navItems?: ClientNavAction[];
}) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          {navItems?.map((item) => {
            if (item.items) {
              return (
                <div key={item.label} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className="flex items-center gap-1 hover:text-black transition-colors"
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-neutral-100 shadow-xl py-2">
                      {item.items.map((subItem) => (
                        <button
                          key={subItem.label}
                          onClick={() => {
                            subItem.onClick?.();
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-600 hover:text-black transition-colors"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (item.type === 'cta') {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="bg-black text-white px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-all text-xs uppercase tracking-widest font-semibold"
                >
                  {item.label}
                </button>
              );
            }

            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="hover:text-black transition-colors"
                >
                  {item.label}
                </button>
              );
            }

            if (item.to) {
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className="hover:text-black transition-colors"
                >
                  {item.label}
                </Link>
              );
            }

            return <span key={item.label}>{item.label}</span>;
          })}
          
        </div>
      </div>
    </nav>
  );
}
