import { clsx } from 'clsx';
import type { FC } from 'react';
import { isDebugMode } from 'utils/version';
import pin from './pin.png';

export const DebugPin: FC<{
  color: 'orange' | 'red';
  title?: string | string[];
  className?: string;
}> = ({ title: titleProp, color, className }) => {
  if (!isDebugMode) return null;
  const title = `${
    titleProp
      ? (Array.isArray(titleProp) ? titleProp : [titleProp]).join(', ')
      : ''
  }`;
  return (
    <div
      className={clsx(
        'pointer-events-auto absolute z-10 m-1 inline-block cursor-default',
        color === 'orange' && 'hue-rotate-15',
        className,
      )}
      title={title}
    >
      <img className="size-[20px]" src={pin} />
    </div>
  );
};
