import clsx from 'clsx';
import type { FC } from 'react';

export const WidgetEmpty: FC<{ className?: string }> = ({ className }) => (
  <div className={clsx(className)}>Nothing to show!</div>
);
