import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Unauthorized</p>
        <h1 className="hero-title">You do not have access to this workspace.</h1>
        <p className="hero-copy">
          Your account is authenticated, but your role or organization does not permit access to the requested page.
        </p>
        <div className="button-row" style={{ marginTop: 24 }}>
          <Link className="button" href="/portal">
            Return to Portal
          </Link>
          <Link className="button-secondary" href="/sign-in">
            Switch Account
          </Link>
        </div>
      </div>
    </div>
  );
}
