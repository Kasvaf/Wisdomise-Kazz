import { type FC } from 'react';
import { clsx } from 'clsx';
import Bullish from './bullish.png';
import Bearish from './bearish.png';
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
    width={64}
    height={64}
    src={value ? icons[value] : icons.bullish}
    className={clsx('object-contain', !value && 'grayscale', className)}
  />
);
