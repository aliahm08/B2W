import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">B2W Client Portal</p>
        <h1 className="hero-title">Sign in to review active work.</h1>
        <p className="hero-copy">
          Use Google, magic link, or any additional sign-in method enabled in Clerk.
        </p>
        <div style={{ marginTop: 24 }}>
          {hasClerk ? (
            <SignIn routing="path" path="/sign-in" />
          ) : (
            <p className="muted-copy">Add Clerk environment variables to render the hosted sign-in UI.</p>
          )}
        </div>
      </div>
    </div>
  );
}
