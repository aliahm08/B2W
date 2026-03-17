import { Link } from 'react-router-dom';
import Seo from './Seo';

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
      />
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.28em] text-neutral-400 mb-6">404</p>
        <h1 className="text-5xl font-medium tracking-tight mb-6">Page not found</h1>
        <p className="max-w-md text-lg text-neutral-500 leading-relaxed mb-12">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center border border-black bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          Back to home
        </Link>
      </section>
    </>
  );
}
