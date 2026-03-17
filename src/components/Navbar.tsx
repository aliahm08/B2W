import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-xl font-medium tracking-tight">B2W</Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <Link to="/#capabilities" className="hover:text-black transition-colors">Capabilities</Link>
          <Link to="/#projects" className="hover:text-black transition-colors">Projects</Link>
          <Link to="/#process" className="hover:text-black transition-colors">Process</Link>
          <Link to="/#team" className="hover:text-black transition-colors">Team</Link>
          <a href="mailto:info@b2w-ai.com?subject=B2W%20Intro%20Call" className="rounded-full border border-black bg-black px-4 py-2 text-white hover:bg-neutral-800 transition-colors">Contact</a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-neutral-100 p-6 flex flex-col gap-4 shadow-lg"
        >
          <Link to="/#capabilities" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Capabilities</Link>
          <Link to="/#projects" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Projects</Link>
          <Link to="/#process" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Process</Link>
          <Link to="/#team" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Team</Link>
          <a href="mailto:info@b2w-ai.com?subject=B2W%20Intro%20Call" className="text-lg font-medium text-black" onClick={() => setIsOpen(false)}>Contact</a>
        </motion.div>
      )}
    </nav>
  );
}
