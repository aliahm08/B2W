export default function Footer() {
  return (
    <footer className="mx-auto max-w-7xl border-t border-neutral-200 px-5 py-10 sm:px-6 sm:py-12">
      <div className="flex flex-col items-start justify-between gap-6 sm:gap-8 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-medium tracking-tight">
            <span className="b2w-wordmark">B2W LLC</span>
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
        </div>
      </div>
    </footer>
  );
}
