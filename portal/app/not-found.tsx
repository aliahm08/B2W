import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Not Found</p>
        <h1 className="hero-title">The requested portal page does not exist.</h1>
        <p className="hero-copy">Check the URL or return to the main dashboard.</p>
        <div className="button-row" style={{ marginTop: 24 }}>
          <Link className="button" href="/portal">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
