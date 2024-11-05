import { clsx } from 'clsx';
import { useState } from 'react';
import { bxChevronDown } from 'boxicons-quasar';
import { type NetworkSecurity } from 'api/types/shared';
import Icon from 'shared/Icon';
import { ReactComponent as Trusted } from './trusted.svg';
import { ReactComponent as Risk } from './risk.svg';
import { ReactComponent as Warning } from './warning.svg';
import { useSecurityRows } from './useSecurityRows';

export function SecurityRow({
  field,
  value,
}: {
  field: keyof NetworkSecurity['detail'];
  value: NetworkSecurity;
}) {
  const rows = useSecurityRows(value.detail);
  const [open, setOpen] = useState(false);
  if (
    !rows[field] ||
    typeof value.detail[field] !== 'string' ||
    value.detail[field] === ''
  )
    return null;
  return (
    <div className="flex flex-col gap-2" onClick={() => setOpen(p => !p)}>
      <div className="flex flex-row items-center gap-1">
        {rows[field].badge === 'risk' ? (
          <Risk className="size-4 shrink-0" />
        ) : rows[field].badge === 'warning' ? (
          <Warning className="size-4 shrink-0" />
        ) : (
          <Trusted className="size-4 shrink-0" />
        )}
        <p className="grow text-xs capitalize">{rows[field].label} </p>
        {rows[field].info && (
          <Icon
            className={clsx(
              'shrink-0 text-v1-content-secondary',
              open && 'rotate-180',
            )}
            name={bxChevronDown}
            size={16}
          />
        )}
      </div>
      {rows[field].info && (
        <p
          className={clsx(
            'text-xxs leading-snug text-v1-content-secondary',
            !open && 'hidden',
          )}
        >
          {rows[field].info}
        </p>
      )}
    </div>
  );
}
