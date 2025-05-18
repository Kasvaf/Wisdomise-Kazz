import { clsx } from 'clsx';
import { type FC } from 'react';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Badge } from 'shared/v1-components/Badge';

export const WinRateBadge: FC<{
  value?: number | null;
  className?: string;
}> = ({ value, className }) =>
  typeof value === 'number' ? (
    <a
      href="https://wisdomise.gitbook.io/auto-trade-guidance"
      target="_blank"
      rel="noreferrer"
      className={clsx('transition-all hover:brightness-110', className)}
    >
      <Badge variant="wsdm">
        <span className="opacity-70">{'Winrate:'}</span>
        <ReadableNumber
          value={value * 100}
          format={{
            decimalLength: 1,
          }}
          popup="never"
          label="%"
        />
      </Badge>
    </a>
  ) : null;
