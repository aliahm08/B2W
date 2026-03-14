type MobileSectionNavItem = {
  id: string;
  label: string;
};

type MobileSectionNavProps = {
  items: MobileSectionNavItem[];
};

export default function MobileSectionNav({ items }: MobileSectionNavProps) {
  return (
    <nav aria-label="Section navigation" className="mb-8 md:hidden">
      <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Jump to</p>
      <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="snap-start whitespace-nowrap border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
