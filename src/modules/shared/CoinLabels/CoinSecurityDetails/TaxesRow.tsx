import { clsx } from 'clsx';
import { type NetworkSecurity } from 'api/discovery';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useSecurityRows } from './useSecurityRows';

export function TaxesRow({ value }: { value: NetworkSecurity }) {
  const rows = useSecurityRows(value.detail);
  return (
    <div className="flex flex-col gap-2 py-2 text-xs">
      <div className="flex flex-row items-center gap-1">
        <div className="flex basis-1/2 items-center gap-1">
          {rows.buy_tax?.label}:
          <ReadableNumber
            value={value.detail.buy_tax ? +value.detail.buy_tax * 100 : null}
            popup="never"
            className={clsx(
              rows.buy_tax?.badge === 'risk'
                ? 'text-v1-content-negative'
                : rows.buy_tax?.badge === 'warning'
                ? 'text-v1-content-notice'
                : 'text-v1-content-positive',
            )}
            label="%"
          />
        </div>
        <div className="flex basis-1/2 items-center gap-1">
          {rows.sell_tax?.label}:
          <ReadableNumber
            value={value.detail.sell_tax ? +value.detail.sell_tax * 100 : null}
            popup="never"
            className={clsx(
              rows.sell_tax?.badge === 'risk'
                ? 'text-v1-content-negative'
                : rows.sell_tax?.badge === 'warning'
                ? 'text-v1-content-notice'
                : 'text-v1-content-positive',
            )}
            label="%"
          />
        </div>
      </div>
      {rows.buy_tax?.info && (
        <p className="text-xxs leading-snug text-v1-content-secondary">
          {rows.buy_tax?.info}
        </p>
      )}
    </div>
  );
}
