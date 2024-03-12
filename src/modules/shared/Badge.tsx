import { clsx } from 'clsx';

export type BadgeColors = 'green' | 'red' | 'blue' | 'white' | 'grey';

const badgeColors = {
  green: clsx('bg-[#40F19C]/20 text-[#40F19C]/80'),
  red: clsx('bg-[#F14056]/20 text-[#F14056]/80'),
  blue: 'bg-[#34A3DA]/20 text-[#34A3DA]',
  white: clsx('bg-white/10 text-white/80'),
  grey: clsx('bg-white/5 text-white/40'),
};

const Badge: React.FC<{
  label: string | React.ReactElement;
  color: BadgeColors;
  className?: string;
}> = ({ color, label, className }) => {
  return (
    <p
      className={clsx(
        'flex items-center justify-center rounded-full px-2 py-1 text-xxs leading-none',
        badgeColors[color],
        className,
      )}
    >
      {label}
    </p>
  );
};

export default Badge;
