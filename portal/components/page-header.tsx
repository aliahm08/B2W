export function PageHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        {description ? <p className="hero-copy" style={{ maxWidth: 760, marginTop: 12 }}>{description}</p> : null}
      </div>
      {actions ? <div className="button-row">{actions}</div> : null}
    </div>
  );
}
