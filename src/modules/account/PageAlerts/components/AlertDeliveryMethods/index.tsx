import { clsx } from 'clsx';
import { Tooltip } from 'antd';
import { type Alert, type AlertDataSource } from 'api/alert';
import { AlertChannelIcon, AlertChannelTitle } from '../AlertChannelsSelect';

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
        <Tooltip title={<AlertChannelTitle name={messanger} />} key={messanger}>
          <AlertChannelIcon
            className="size-6 cursor-alias stroke-v1-border-brand"
            name={messanger}
          />
        </Tooltip>
      ))}
    </span>
  );
}
