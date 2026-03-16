import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">B2W Client Portal</p>
        <h1 className="hero-title">Create your portal access.</h1>
        <p className="hero-copy">Invited client users can finish setup here after receiving an organization invite.</p>
        <div style={{ marginTop: 24 }}>
          {hasClerk ? (
            <SignUp routing="path" path="/sign-up" />
          ) : (
            <p className="muted-copy">Add Clerk environment variables to render the hosted sign-up UI.</p>
          )}
        </div>
      </div>
    </div>
  );
}
