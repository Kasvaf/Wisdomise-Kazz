import { clsx } from 'clsx';
import { type PropsWithChildren, type FC } from 'react';

const badgeColors = {
  green: clsx('border-transparent bg-[#183B2A] text-[#40F19C]/95'),
  purple: clsx('border-[#9747FF]/40 bg-[#9747FF]/10 text-white'),
  orange: clsx('border-transparent bg-[#F1AA40]/10 text-[#F1AA40]'),
};

export type PageCardBadgeColors = keyof typeof badgeColors;

const CardPageLinkBadge: FC<
  PropsWithChildren<{
    color: PageCardBadgeColors;
    className?: string;
  }>
> = ({ color, children, className }) => {
  return (
    <div
      className={clsx(
        'h-10 overflow-x-auto whitespace-nowrap rounded-full border-[2px] px-6 text-xxs font-medium',
        'inline-flex items-center justify-center gap-2',
        badgeColors[color],
        className,
      )}
    >
      {children}
    </div>
  );
};

export default CardPageLinkBadge;
