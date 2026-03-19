export default function Footer() {
  return (
    <footer className="py-12 px-6 max-w-7xl mx-auto border-t border-neutral-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h3 className="text-lg font-medium tracking-tight">
            <span className="b2w-wordmark">B2W</span>
          </h3>
          <p className="text-sm text-neutral-500 mt-2">© {new Date().getFullYear()} All rights reserved.</p>
        </div>

        <div className="flex gap-8 text-sm text-neutral-600">
          <a href="mailto:info@b2w-ai.com?subject=B2W%20Inquiry" className="hover:text-black transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
