import { useEffect, useState } from 'react';

type ProfileSectionNavItem = {
  id: string;
  label: string;
};

type ProfileSectionNavProps = {
  items: ProfileSectionNavItem[];
  eyebrow?: string;
  description?: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export default function ProfileSectionNav({
  items,
  eyebrow = 'Section navigation',
  description,
}: ProfileSectionNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const sectionElements = items
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
    <nav aria-label="Profile section navigation" className="lg:sticky lg:top-24 lg:z-20">
      <div className="border border-neutral-200 bg-white lg:bg-white/96 lg:backdrop-blur-sm">
        <div className="border-b border-neutral-200 px-4 py-4 md:px-5">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">{eyebrow}</p>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">{description}</p>
          ) : null}
        </div>

        <div className="md:hidden">
          <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 py-4">
            {items.map((item, index) => {
              const isActive = item.id === activeId;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={() => setActiveId(item.id)}
                  className={cx(
                    'snap-start whitespace-nowrap border px-3 py-2 text-xs font-medium transition-colors',
                    isActive
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-black hover:text-black',
                  )}
                >
                  <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.18em] opacity-70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const isActive = item.id === activeId;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={() => setActiveId(item.id)}
                className={cx(
                  'group flex min-h-24 items-start gap-4 border-l border-t border-neutral-200 px-5 py-4 transition-colors first:border-l-0 lg:min-h-28',
                  isActive ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900 hover:bg-neutral-50',
                )}
              >
                <span
                  className={cx(
                    'mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em]',
                    isActive ? 'text-neutral-400' : 'text-neutral-500',
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="space-y-2">
                  <span className="block text-sm font-medium leading-5">{item.label}</span>
                  <span
                    className={cx(
                      'block h-px w-8 transition-all',
                      isActive ? 'bg-white' : 'bg-neutral-300 group-hover:w-12 group-hover:bg-black',
                    )}
                  />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
