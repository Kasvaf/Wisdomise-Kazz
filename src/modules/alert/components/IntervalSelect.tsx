import { clsx } from 'clsx';
import {
  type ComponentProps,
  type FC,
  type ReactNode,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from 'shared/v1-components/Select';
import { formatNumber } from 'utils/numbers';

const useCustomOption = (value?: number, cooldownMode?: boolean) => {
  const { t } = useTranslation('alerts');
  return useMemo(() => {
    const formattedNumber =
      typeof value === 'number'
        ? formatNumber(value, {
            compactInteger: false,
            decimalLength: Number.POSITIVE_INFINITY,
            minifyDecimalRepeats: false,
            separateByComma: true,
          })
        : null;
    return formattedNumber
      ? {
          label: (
            <span className="underline underline-offset-4">
              {cooldownMode
                ? t('common.notifications.invervals.after', {
                    seconds: formattedNumber,
                  })
                : t('common.notifications.invervals.every', {
                    seconds: formattedNumber,
                  })}
            </span>
          ),
          value: value ?? 0,
        }
      : null;
  }, [t, value, cooldownMode]);
};

const useIntervalOptions = (
  cooldownMode: boolean,
  query: string,
  currentValue?: number | null,
) => {
  const { t } = useTranslation('alerts');
  const queryOption = useCustomOption(
    /^\d+$/.test(query) ? +query : undefined,
    cooldownMode,
  );
  const customValueOption = useCustomOption(
    currentValue ?? undefined,
    cooldownMode,
  );

  return useMemo(() => {
    let options: Array<{ label: ReactNode; value: number }> = cooldownMode
      ? [
          {
            label: `1 ${t('common.notifications.invervals.hour')}`,
            value: 3600,
          },
          {
            label: `2 ${t('common.notifications.invervals.hour')}`,
            value: 7200,
          },
          {
            label: `4 ${t('common.notifications.invervals.hour')}`,
            value: 14_400,
          },
          {
            label: `6 ${t('common.notifications.invervals.hour')}`,
            value: 21_600,
          },
          {
            label: `12 ${t('common.notifications.invervals.hour')}`,
            value: 43_200,
          },
          {
            label: `24 ${t('common.notifications.invervals.hour')}`,
            value: 86_400,
          },
        ]
      : [
          {
            label: t('common.notifications.invervals.hourly'),
            value: 3600,
          },
          {
            label: t('common.notifications.invervals.daily'),
            value: 86_400,
          },
          {
            label: t('common.notifications.invervals.weekly'),
            value: 604_800,
          },
          {
            label: t('common.notifications.invervals.monthly'),
            value: 2_592_000,
          },
        ];

    // Add custom value if needed
    if (
      customValueOption !== null &&
      options.findIndex(opt => opt.value === customValueOption.value) === -1
    ) {
      options = [customValueOption, ...options];
    }

    // Apply general filter optioj
    options = options.filter(
      opt =>
        !query ||
        opt.label?.toString().toLowerCase().includes(query.toLowerCase()),
    );

    // Add runtime value if needed
    if (queryOption !== null) {
      options = [queryOption, ...options];
    }

    return options;
  }, [cooldownMode, t, queryOption, customValueOption, query]);
};

export const IntervalSelect: FC<
  ComponentProps<typeof Select<number>> & {
    cooldownMode: boolean;
  }
> = ({ cooldownMode, className, disabled, value, ...props }) => {
  const [query, setQuery] = useState('');

  const options = useIntervalOptions(cooldownMode || false, query, value);

  return (
    <Select
      allowClear={false}
      className={clsx('[&_.ant-select-selector]:!bg-black/20', className)}
      dialogClassName="min-w-[100px]"
      disabled={disabled}
      onSearch={cooldownMode ? undefined : setQuery}
      options={options.map(option => option.value)}
      render={v => {
        const opt = options.find(x => x.value === v);
        return opt?.label ?? '---';
      }}
      searchValue={cooldownMode ? undefined : query}
      showSearch={!cooldownMode}
      value={value}
      {...props}
    />
  );
};
