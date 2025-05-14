import { clsx } from 'clsx';
import badge from './images/wise-gold.png';
import mini from './images/wise-mini.png';

export default function VipBadge({
  className,
  mode = 'default',
}: {
  className?: string;
  mode?: 'default' | 'mini';
}) {
  return (
    <img
      src={mode === 'default' ? badge : mini}
      alt="wise"
      className={clsx(className, 'inline-block h-4')}
    />
  );
}
