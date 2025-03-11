import { type ComponentProps } from 'react';
import { clsx } from 'clsx';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { useScrollPoint } from '../hooks/useScrollPoint';

export function CoinRadarTabs({
  className,
  options,
}: {
  className?: string;
  options: ComponentProps<typeof ButtonSelect<string>>['options'];
}) {
  const { onChange, value } = useScrollPoint(options, 350);
  return (
    <div className={clsx('w-full bg-v1-surface-l1 py-2', className)}>
      <ButtonSelect
        value={value}
        options={options}
        onChange={onChange}
        surface={1}
        className="rounded-none"
      />
    </div>
  );
}
