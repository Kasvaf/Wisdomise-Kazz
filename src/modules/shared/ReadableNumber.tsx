import { clsx } from 'clsx';
import { useMemo } from 'react';
import { Tooltip } from 'antd';
import { type FormatNumberOptions, formatNumber } from 'utils/numbers';

interface NumberLabelConfig {
  text: string;
  position: 'before' | 'after';
  small: boolean;
}

const PRECONFIGURED_LABELS: Record<
  '%' | '$' | 'usdt' | 'eth',
  NumberLabelConfig
> = {
  '%': {
    text: '%',
    position: 'after',
    small: false,
  },
  '$': {
    text: '$',
    position: 'before',
    small: false,
  },
  'usdt': {
    text: 'USDT',
    position: 'after',
    small: true,
  },
  'eth': {
    text: 'ETH',
    position: 'after',
    small: true,
  },
};

function NumberWithLabel({
  label,
  value,
  className,
  ...props
}: {
  label?: keyof typeof PRECONFIGURED_LABELS | NumberLabelConfig;
  value: string;
  className?: string;
}) {
  const formatObject =
    typeof label === 'string'
      ? PRECONFIGURED_LABELS[label]
      : label || undefined;
  return (
    <span
      {...props}
      className={clsx(
        'inline-flex flex-wrap items-baseline overflow-hidden',
        formatObject?.position === 'before'
          ? 'flex-row-reverse gap-x-px'
          : 'gap-x-[2px]',
        className,
      )}
      style={{
        justifyContent: 'left',
      }}
    >
      <span>{value}</span>
      {formatObject?.text && (
        <span
          className={clsx(
            'opacity-70',
            formatObject?.small && 'origin-bottom scale-90',
          )}
        >
          {formatObject?.text}
        </span>
      )}
    </span>
  );
}

export function ReadableNumber({
  className,
  label,
  popup = 'auto',
  value,
  format,
}: {
  className?: string;
  label?: keyof typeof PRECONFIGURED_LABELS | NumberLabelConfig;
  value: number;
  popup?: 'auto' | 'always' | 'never';
  format?: Partial<FormatNumberOptions>;
}) {
  const displayValue = useMemo(() => {
    return formatNumber(value, {
      compactInteger: value >= 1e6,
      decimalLength: 3,
      minifyDecimalRepeats: true,
      seperateByComma: true,
      ...format,
    });
  }, [value, format]);
  const tooltipValue = useMemo(() => {
    return formatNumber(value, {
      compactInteger: false,
      decimalLength: Number.POSITIVE_INFINITY,
      minifyDecimalRepeats: false,
      seperateByComma: true,
    });
  }, [value]);

  const noPopup =
    popup === 'never' || (popup === 'auto' && displayValue === tooltipValue);

  return (
    <Tooltip
      color="#151619"
      overlayInnerStyle={{
        padding: '0.75rem',
        fontSize: '0.9rem',
        fontFamily: 'monospace',
      }}
      title={<NumberWithLabel label={label} value={tooltipValue} />}
      overlayClassName="pointer-events-none"
      open={noPopup ? false : undefined}
    >
      <NumberWithLabel
        label={label}
        value={displayValue}
        className={clsx('cursor-default', className)}
      />
    </Tooltip>
  );
}
