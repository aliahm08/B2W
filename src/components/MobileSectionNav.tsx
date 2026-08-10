type MobileSectionNavItem = {
  id: string;
  label: string;
};

type MobileSectionNavProps = {
  items: MobileSectionNavItem[];
};

export default function MobileSectionNav({ items }: MobileSectionNavProps) {
  return (
    <nav aria-label="Section navigation" className="sticky top-20 z-30 mb-8 min-w-0 overflow-hidden border-y border-neutral-200 bg-white/92 py-3 backdrop-blur-sm md:hidden">
      <div className="px-3">
        <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Jump to</p>
      </div>
      <div className="flex max-w-full snap-x gap-2 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="inline-flex min-h-11 snap-start items-center whitespace-nowrap border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
