import { clsx } from 'clsx';

const badgeColors = {
  green: clsx('bg-[#40F19C]/20 text-[#40F19C]/80'),
  red: clsx('bg-[#F14056]/20 text-[#F14056]/80'),
  blue: 'bg-[#34A3DA]/20 text-[#34A3DA]',
  white: clsx('bg-white/10 text-white/80'),
  black: clsx('bg-black text-white'),
  grey: clsx('bg-white/5 text-white/40'),
  purple: clsx('bg-[#B634DA4D] text-[#C968E4]'),
  orange: clsx('bg-[#C371114D] text-[#EBA24C]'),
  gradient: 'bg-brand-gradient text-black',
  pro: 'bg-pro-gradient text-black',
};

export type BadgeColors = keyof typeof badgeColors;

const Badge: React.FC<{
  label: string | React.ReactElement;
  color: BadgeColors;
  className?: string;
}> = ({ color, label, className }) => {
  return (
    <p
      className={clsx(
        'flex h-4 items-center justify-center rounded-full px-2 text-xxs leading-none',
        badgeColors[color],
        className,
      )}
    >
      {label}
    </p>
  );
};

export default Badge;
