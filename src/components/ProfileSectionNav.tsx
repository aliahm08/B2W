import { useEffect, useState } from 'react';

export type ProfileSectionNavItem = {
  id: string;
  label: string;
  action?: () => void;
};

type ProfileSectionNavProps = {
  items: ProfileSectionNavItem[];
  description?: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export default function ProfileSectionNav({
  items,
  description,
}: ProfileSectionNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    if (items.length === 0) {
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

      setActiveId(currentSection.id);
    };

    updateActiveSection();

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);

        if (visibleEntries[0]?.target instanceof HTMLElement) {
          setActiveId(visibleEntries[0].target.id);
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
  }, [items]);

  return (
    <nav aria-label="Profile section navigation" className="sticky top-20 z-30 -mx-4 border-y border-neutral-200 bg-white/92 backdrop-blur-sm sm:-mx-6">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        {description ? (
          <div className="mb-3 flex items-end justify-between gap-4">
            <p className="max-w-3xl text-xs leading-5 text-neutral-500 md:text-sm">{description}</p>
            <p className="hidden text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400 md:block">
              {String(items.findIndex((item) => item.id === activeId) + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </p>
          </div>
        ) : null}

        <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, index) => {
            if (item.action) {
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="snap-start whitespace-nowrap border border-black bg-black px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-800 md:text-sm"
                >
                  <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </button>
              );
            }

            const isActive = item.id === activeId;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={() => setActiveId(item.id)}
                className={cx(
                  'snap-start whitespace-nowrap border px-4 py-2 text-xs font-medium transition-colors md:text-sm',
                  isActive
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-black hover:text-black',
                )}
              >
                <span className={cx('mr-2 font-mono text-[10px] uppercase tracking-[0.18em]', isActive ? 'text-neutral-400' : 'text-neutral-400')}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
