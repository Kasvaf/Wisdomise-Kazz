import { useSubscription } from 'api';
import { clsx } from 'clsx';
import badge from './images/wise-gold.png';
import mini from './images/wise-mini.png';

export default function VipBadge({
  className,
  mode = 'default',
  hideOnVip,
}: {
  className?: string;
  mode?: 'default' | 'mini';
  hideOnVip?: boolean;
}) {
  const { group } = useSubscription();

  return hideOnVip && group !== 'free' ? null : (
    <img
      alt="wise"
      className={clsx(className, 'inline-block h-4')}
      src={mode === 'default' ? badge : mini}
    />
  );
}
