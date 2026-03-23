import { useEffect, useState } from 'react';

export type ProfileSectionNavItem = {
  id: string;
  label: string;
  action?: () => void;
};

type ProfileSectionNavProps = {
  items: ProfileSectionNavItem[];
  description?: string;
  /** Controlled active tab id — when set, the nav acts as a tab bar instead of scroll-spy. */
  activeId?: string;
  /** Called when a tab is clicked (controlled mode). */
  onSelect?: (id: string) => void;
  tone?: 'neutral' | 'green';
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export default function ProfileSectionNav({
  items,
  description,
  activeId: controlledActiveId,
  onSelect,
  tone = 'neutral',
}: ProfileSectionNavProps) {
  const isControlled = controlledActiveId !== undefined;
  const [internalActiveId, setInternalActiveId] = useState(items[0]?.id ?? '');
  const activeId = isControlled ? controlledActiveId : internalActiveId;

  /* Scroll-spy mode (uncontrolled) */
  useEffect(() => {
    if (isControlled || items.length === 0) {
      return;
    }

    const sectionElements = items
      .filter((item) => !item.action)
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element instanceof HTMLElement);

    if (sectionElements.length === 0) {
      return;
    }

    const updateActiveSection = () => {
      let currentSection = sectionElements[0];

      sectionElements.forEach((element) => {
        if (element.getBoundingClientRect().top <= 180) {
          currentSection = element;
        }
      });

      setInternalActiveId(currentSection.id);
    };

    updateActiveSection();

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);

        if (visibleEntries[0]?.target instanceof HTMLElement) {
          setInternalActiveId(visibleEntries[0].target.id);
        } else {
          updateActiveSection();
        }
      },
      {
        rootMargin: '-18% 0px -62% 0px',
        threshold: [0.15, 0.35, 0.6],
      },
    );

    sectionElements.forEach((element) => observer.observe(element));
    window.addEventListener('scroll', updateActiveSection, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateActiveSection);
    };
  }, [items, isControlled]);

  const handleClick = (item: ProfileSectionNavItem) => {
    if (item.action) {
      item.action();
      return;
    }

    if (isControlled && onSelect) {
      onSelect(item.id);
    } else {
      setInternalActiveId(item.id);
    }
  };

  const activeClassName =
    tone === 'green'
      ? 'border-emerald-700 bg-emerald-600 text-white'
      : 'border-black bg-black text-white';
  const inactiveClassName =
    tone === 'green'
      ? 'border-emerald-200 bg-white text-emerald-800 hover:border-emerald-500 hover:text-emerald-900'
      : 'border-neutral-200 bg-white text-neutral-600 hover:border-black hover:text-black';
  const actionClassName =
    tone === 'green'
      ? 'border-emerald-700 bg-emerald-600 text-white hover:bg-emerald-700'
      : 'border-black bg-black text-white hover:bg-neutral-800';

  return (
    <nav aria-label="Profile section navigation" className="sticky top-20 z-30 -mx-4 border-y border-neutral-200 bg-white/92 backdrop-blur-sm sm:-mx-6">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        {description ? (
          <p className="mb-3 max-w-3xl text-sm leading-6 text-neutral-600">{description}</p>
        ) : null}
        <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, index) => {
            const isActive = item.id === activeId;

            if (item.action) {
              return (
                <button
                  key={item.id}
                  onClick={() => handleClick(item)}
                  className={cx(
                    'snap-start whitespace-nowrap border px-4 py-2 text-xs font-medium transition-colors md:text-sm',
                    actionClassName,
                  )}
                >
                  <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </button>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? 'location' : undefined}
                onClick={() => handleClick(item)}
                className={cx(
                  'snap-start whitespace-nowrap border px-4 py-2 text-xs font-medium transition-colors md:text-sm',
                  isActive ? activeClassName : inactiveClassName,
                )}
              >
                <span className={cx('mr-2 font-mono text-[10px] uppercase tracking-[0.18em]', isActive ? 'text-neutral-400' : 'text-neutral-400')}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
