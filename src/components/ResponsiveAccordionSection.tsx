import { useState, type ReactNode } from 'react';
import { ChevronDown, type LucideIcon } from 'lucide-react';

type ResponsiveAccordionSectionProps = {
  id?: string;
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  titleClassName?: string;
  tone?: 'light' | 'dark';
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export default function ResponsiveAccordionSection({
  id,
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  className,
  headerClassName,
  bodyClassName,
  titleClassName,
  tone = 'light',
}: ResponsiveAccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const iconShellClassName =
    tone === 'dark'
      ? 'rounded-sm bg-white/10 p-2 text-white'
      : 'rounded-sm bg-neutral-100 p-2 text-black';

  const chevronClassName = tone === 'dark' ? 'text-stone-400' : 'text-neutral-400';

  return (
    <section id={id} className={className}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cx(
          'flex w-full items-center gap-3 text-left md:cursor-default',
          headerClassName,
        )}
      >
        {Icon ? (
          <div className={iconShellClassName}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
        <h2 className={cx('flex-1 text-xl font-medium md:text-2xl', titleClassName)}>{title}</h2>
        <ChevronDown
          className={cx(
            'h-4 w-4 shrink-0 transition-transform md:hidden',
            chevronClassName,
            isOpen && 'rotate-180',
          )}
        />
      </button>

      <div className={cx(isOpen ? 'block' : 'hidden', 'md:block')}>
        <div className={bodyClassName}>{children}</div>
      </div>
    </section>
  );
}
