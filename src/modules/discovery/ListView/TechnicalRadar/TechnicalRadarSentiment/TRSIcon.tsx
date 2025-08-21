import { clsx } from 'clsx';
import type { FC } from 'react';
import Bearish from './bearish.png';
import Bullish from './bullish.png';
import Cheap from './cheap.png';
import Expensive from './expensive.png';

const icons = {
  bullish: Bullish,
  bearish: Bearish,
  cheap: Cheap,
  expensive: Expensive,
};

export const TRSIcon: FC<{
  value?: keyof typeof icons;
  className?: string;
}> = ({ value, className }) => (
  <img
    className={clsx('object-contain', !value && 'grayscale', className)}
    height={64}
    src={value ? icons[value] : icons.bullish}
    width={64}
  />
);
