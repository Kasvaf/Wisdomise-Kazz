import { clsx } from 'clsx';
import { type Alert, type AlertDataSource } from 'api/alert';
import { AlertChannelIcon } from '../AlertChannelsSelect';

export function AlertDeliveryMethods<D extends AlertDataSource>({
  value,
  className,
}: {
  value: Alert<D>;
  className?: string;
}) {
  return (
    <span className={clsx('inline-flex items-center gap-2', className)}>
      {value.messengers.map(messanger => (
        <AlertChannelIcon
          className="size-6 stroke-v1-border-brand"
          key={messanger}
          name={messanger}
        />
      ))}
    </span>
  );
}
