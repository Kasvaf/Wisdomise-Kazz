import { type FC } from 'react';
import { clsx } from 'clsx';
import { isDebugMode } from 'utils/version';
import pin from './pin.png';

export const DebugPin: FC<{
  value?: string | string[];
  type?: 'featureFlag';
  className?: string;
}> = ({ value, type = 'featureFlag', className }) => {
  if (!isDebugMode) return null;
  const tooltip = `${type.toUpperCase()}: ${
    value ? (Array.isArray(value) ? value : [value]).join(', ') : ''
  }`;
  return (
    <div
      className={clsx(
        'pointer-events-auto absolute z-10 m-1 inline-block cursor-default',
        type === 'featureFlag' && 'hue-rotate-15',
        className,
      )}
      title={tooltip}
    >
      <img src={pin} className="size-[20px]" />
    </div>
  );
};
