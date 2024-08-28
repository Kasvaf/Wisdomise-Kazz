import { clsx } from 'clsx';
import { useMemo } from 'react';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { type FormatNumberOptions, formatNumber } from 'utils/numbers';

function NumberWithLabel({
  label,
  value,
  emptyText,
  className,
  ...props
}: {
  label?: string | null;
  emptyText?: string;
  value?: string;
  className?: string;
}) {
  const { t } = useTranslation('common');
  const labelObject = useMemo(
    () => ({
      text: label ? label.toUpperCase() : '',
      position: (label?.length || 0) > 1 || label === '%' ? 'after' : 'before',
      small: (label?.length || 0) > 1,
    }),
    [label],
  );

  return (
    <span
      {...props}
      className={clsx(
        'inline-flex flex-nowrap items-baseline overflow-hidden',
        typeof value !== 'string' && 'font-light opacity-70',
        labelObject?.position === 'before'
          ? 'flex-row-reverse gap-x-px'
          : 'gap-x-[2px]',
        'tracking-[0.045em]',
        className,
      )}
      style={{
        justifyContent: 'left',
      }}
    >
      <span className="whitespace-nowrap">
        {typeof value === 'string' ? value : emptyText ?? t('not-available')}
      </span>
      {labelObject?.text && typeof value === 'string' && (
        <span
          className={clsx(
            'opacity-70',
            labelObject?.small && 'ms-px text-[80%]',
          )}
        >
          {labelObject?.text}
        </span>
      )}
    </span>
  );
}

export function ReadableNumber({
  className,
  label,
  value,
  emptyText,
  popup = 'auto',
  format,
}: {
  className?: string;
  label?: string | null;
  value?: number | null;
  emptyText?: string;
  popup?: 'auto' | 'always' | 'never';
  format?: Partial<FormatNumberOptions>;
}) {
  const displayValue = useMemo(() => {
    if (typeof value !== 'number') return;
    return formatNumber(value, {
      compactInteger: true,
      decimalLength: 3,
      minifyDecimalRepeats: true,
      seperateByComma: true,
      ...format,
    });
  }, [value, format]);
  const tooltipValue = useMemo(() => {
    if (typeof value !== 'number') return;
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
        width: 'max-content',
      }}
      title={
        <NumberWithLabel
          label={label}
          value={tooltipValue}
          emptyText={emptyText}
        />
      }
      overlayClassName="pointer-events-none"
      open={noPopup ? false : undefined}
    >
      <NumberWithLabel
        label={label}
        value={displayValue}
        emptyText={emptyText}
        className={clsx(displayValue && !noPopup && 'cursor-alias', className)}
      />
    </Tooltip>
  );
}
