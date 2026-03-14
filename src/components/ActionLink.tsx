import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type ActionLinkVariant = 'underline' | 'outline';

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ActionLinkVariant;
} & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'children'>;

const baseClassName =
  'group inline-flex items-center justify-center gap-2 text-lg font-medium leading-none text-black transition-colors';

const variantClassNames: Record<ActionLinkVariant, string> = {
  underline: 'border-b border-black pb-1 hover:text-neutral-600',
  outline: 'min-h-12 border border-black px-5 py-3 hover:bg-black hover:text-white',
};

export default function ActionLink({
  href,
  children,
  variant = 'underline',
  className = '',
  ...props
}: ActionLinkProps) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClassName} ${variantClassNames[variant]} ${className}`.trim()}
      {...props}
    >
      <span>{children}</span>
      <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
    </motion.a>
  );
}
