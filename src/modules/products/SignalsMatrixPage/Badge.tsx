import { clsx } from 'clsx';
import { type Colors } from './constants';

const badgeColors = {
  green: clsx('bg-[#40F19C]/20 text-[#40F19C]/80'),
  red: clsx('bg-[#F14056]/20 text-[#F14056]/80'),
  white: clsx('bg-white/10 text-white/80'),
  grey: clsx('bg-white/5 text-white/40'),
};

const Badge: React.FC<{
  label: string;
  color: Colors;
}> = ({ color, label }) => {
  return (
    <p
      className={clsx(
        'rounded-full px-2 py-1 text-xxs leading-none',
        badgeColors[color],
      )}
    >
      {label}
    </p>
  );
};

export default Badge;
