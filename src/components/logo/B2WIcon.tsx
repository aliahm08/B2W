import type { SVGProps } from 'react';

export type B2WIconProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

export default function B2WIcon({
  title = 'B2W silhouette mark',
  ...props
}: B2WIconProps) {
  return (
    <svg
      viewBox="0 0 96 88.4925"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <use href="/brand/b2w-icon.svg#b2w-icon-path" />
    </svg>
  );
}
