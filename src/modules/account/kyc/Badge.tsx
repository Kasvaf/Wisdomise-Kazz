import { clsx } from 'clsx';
import type React from 'react';

interface Props {
  text: string;
  color?: 'green' | 'red' | 'blue' | 'white';
  className?: string;
}

const colorClasses = {
  green: 'bg-[#40F19C]/20 text-[#40F19C]',
  red: 'bg-[#F14056]/20 text-[#F14056]',
  blue: 'bg-[#34A3DA]/20 text-[#34A3DA]',
  white: 'bg-white/20 text-white',
};

const Badge: React.FC<Props> = ({ text, color = 'white', className }) => (
  <div
    className={clsx(
      'rounded-xl px-4 py-2 text-xs',
      colorClasses[color],
      className,
    )}
  >
    {text}
  </div>
);

export default Badge;
