import type { SVGProps } from 'react';

export type GurgeIconName =
  | 'brand'
  | 'overview'
  | 'job'
  | 'location'
  | 'report'
  | 'account'
  | 'activity'
  | 'gate'
  | 'update';

type GurgeIconProps = SVGProps<SVGSVGElement> & {
  name: GurgeIconName;
  title?: string;
};

export default function GurgeIcon({ name, title, ...props }: GurgeIconProps) {
  const labelled = Boolean(title);

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={labelled ? 'img' : undefined}
      aria-hidden={labelled ? undefined : true}
      data-gurge-icon={name}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {name === 'brand' ? (
        <>
          <path d="M12 2.75 18.25 6.4v7.2L12 17.25 5.75 13.6V6.4L12 2.75Z" />
          <path d="m12 7.1 2.8 1.62v3.24L12 13.58l-2.8-1.62V8.72L12 7.1Z" />
          <path d="M12 17.25v4M5.75 13.6l-3.1 1.8M18.25 13.6l3.1 1.8" />
        </>
      ) : null}
      {name === 'overview' ? (
        <>
          <rect x="3" y="3" width="7.25" height="7.25" rx="1.6" />
          <rect x="13.75" y="3" width="7.25" height="7.25" rx="1.6" />
          <rect x="3" y="13.75" width="7.25" height="7.25" rx="1.6" />
          <path d="M14 17.4h7M17.5 14v7" />
        </>
      ) : null}
      {name === 'job' ? (
        <>
          <path d="M7 5.25V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.25" />
          <rect x="3" y="5.25" width="18" height="15.25" rx="2" />
          <path d="M3 10.25h18M9.5 10.25v2.5h5v-2.5" />
        </>
      ) : null}
      {name === 'location' ? (
        <>
          <path d="M19.5 10c0 5.4-7.5 11-7.5 11S4.5 15.4 4.5 10a7.5 7.5 0 1 1 15 0Z" />
          <path d="M8.75 11.75V7.5h6.5v4.25M10.5 7.5V5.75h3V7.5M10.75 11.75V9.5h2.5v2.25" />
        </>
      ) : null}
      {name === 'report' ? (
        <>
          <path d="M4 20V4M4 20h16" />
          <path d="M7.25 16v-4M11.25 16V7.5M15.25 16v-6M19.25 16V5" />
          <path d="m7.25 8.5 4-3 4 1.5 4-4" />
        </>
      ) : null}
      {name === 'account' ? (
        <>
          <circle cx="12" cy="8" r="3.25" />
          <path d="M5.25 20c.45-4.15 2.7-6.25 6.75-6.25s6.3 2.1 6.75 6.25" />
          <path d="M3 12a9 9 0 1 1 18 0" />
        </>
      ) : null}
      {name === 'activity' ? (
        <>
          <path d="M2.5 12h4l2.1-6.5 4.2 13 2.15-6.5h6.55" />
          <circle cx="12" cy="12" r="9" opacity=".28" />
        </>
      ) : null}
      {name === 'gate' ? (
        <>
          <path d="M12 2.75 21.25 12 12 21.25 2.75 12 12 2.75Z" />
          <path d="m8.5 12 2.25 2.25 4.75-5" />
        </>
      ) : null}
      {name === 'update' ? (
        <>
          <path d="M4 6.5h10.5M4 12h7M4 17.5h10.5" />
          <path d="m16 9 4 3-4 3" />
        </>
      ) : null}
    </svg>
  );
}
