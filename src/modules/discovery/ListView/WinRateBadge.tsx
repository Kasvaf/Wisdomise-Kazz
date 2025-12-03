import { bxChevronRight } from 'boxicons-quasar';
import { clsx } from 'clsx';
import type { FC } from 'react';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Badge } from 'shared/v1-components/Badge';

export const WinRateBadge: FC<{
  value?: number | null;
  className?: string;
}> = ({ value, className }) =>
  typeof value === 'number' ? (
    <a
      className={clsx('transition-all hover:brightness-110', className)}
      href="https://wisdomise.gitbook.io/auto-trade-guidance"
      rel="noreferrer"
      target="_blank"
    >
      <Badge>
        <span className="opacity-70">{'Winrate:'}</span>
        <ReadableNumber
          format={{
            decimalLength: 1,
          }}
          label="%"
          popup="never"
          value={value * 100}
        />
        <Icon className="-me-1" name={bxChevronRight} size={16} />
      </Badge>
    </a>
  ) : null;
