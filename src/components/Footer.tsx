import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-7xl border-t border-neutral-200 px-5 py-10 sm:px-6 sm:py-12">
      <div className="flex flex-col items-start justify-between gap-6 sm:gap-8 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-medium tracking-tight">
            <Link to="/" className="b2w-wordmark underline-offset-4 transition-colors hover:text-neutral-600 hover:underline">
              B2W LLC
            </Link>
          </h3>
          <p className="text-sm text-neutral-500 mt-2">© {new Date().getFullYear()} All rights reserved.</p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-600">
          <a
            href="mailto:info@b2w-ai.com?subject=B2W%20Inquiry"
            className="inline-flex min-h-10 items-center hover:text-black transition-colors"
          >
            Contact
          </a>
          <Link
            to="/jasonai"
            className="inline-flex min-h-10 items-center gap-1.5 text-xs text-neutral-500 hover:text-black transition-colors"
          >
            Get JasonAI <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
