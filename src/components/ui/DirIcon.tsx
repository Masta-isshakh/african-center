import type { LucideIcon, LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DirIconProps extends LucideProps {
  icon: LucideIcon;
  /** Mirror in RTL — for chevrons, arrows and anything that points along the reading direction. */
  flip?: boolean;
}

/** Every lucide icon goes through here so direction-aware icons mirror automatically in Arabic. */
export function DirIcon({ icon: Icon, flip = false, className, ...props }: DirIconProps) {
  return <Icon aria-hidden="true" focusable="false" className={cn(flip && 'rtl:-scale-x-100', className)} {...props} />;
}
