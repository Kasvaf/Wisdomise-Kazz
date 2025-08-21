import { Tooltip } from 'antd';
import type { Alert } from 'api/alert';
import { clsx } from 'clsx';
import { AlertChannelIcon, AlertChannelTitle } from './AlertChannelsSelect';

export function AlertDeliveryMethods({
  value,
  className,
}: {
  value: Alert;
  className?: string;
}) {
  return (
    <span className={clsx('inline-flex items-center gap-2', className)}>
      {value.messengers.map(messanger => (
        <Tooltip key={messanger} title={<AlertChannelTitle name={messanger} />}>
          <AlertChannelIcon
            className="size-6 cursor-alias stroke-v1-border-brand"
            name={messanger}
          />
        </Tooltip>
      ))}
    </span>
  );
}
