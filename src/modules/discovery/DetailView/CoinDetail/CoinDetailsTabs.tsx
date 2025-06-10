import { type ComponentProps } from 'react';
import { clsx } from 'clsx';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { useScrollPoint } from './useScrollPoint';

export function CoinDetailsTabs({
  className,
  options,
  hr,
}: {
  className?: string;
  options: ComponentProps<typeof ButtonSelect<string>>['options'];
  hr?: boolean;
}) {
  const { onChange, value } = useScrollPoint(options, 350);
  if (options.filter(x => !x.hidden).length < 2) return null;
  return (
    <>
      <div className={clsx(className)}>
        <ButtonSelect
          value={value}
          options={options}
          onChange={onChange}
          surface={1}
          className="max-w-full rounded-none"
          size="md"
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
