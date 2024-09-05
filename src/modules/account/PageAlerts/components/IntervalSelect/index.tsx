import { Select, type SelectProps } from 'antd';
import { type DefaultOptionType } from 'antd/es/select';
import { clsx } from 'clsx';
import { useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
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
            seperateByComma: true,
          })
        : null;
    return formattedNumber
      ? {
          label: (
            <span className="underline underline-offset-4">
              {cooldownMode
                ? t('forms.notifications.invervals.after', {
                    seconds: formattedNumber,
                  })
                : t('forms.notifications.invervals.every', {
                    seconds: formattedNumber,
                  })}
            </span>
          ),
          value,
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

  return useMemo<DefaultOptionType[]>(() => {
    let options: DefaultOptionType[] = cooldownMode
      ? [
          {
            label: `1 ${t('forms.notifications.invervals.min')}`,
            value: 60,
          },
          {
            label: `3 ${t('forms.notifications.invervals.min')}`,
            value: 180,
          },
          {
            label: `10 ${t('forms.notifications.invervals.min')}`,
            value: 600,
          },
          {
            label: `15 ${t('forms.notifications.invervals.min')}`,
            value: 900,
          },
          {
            label: `30 ${t('forms.notifications.invervals.min')}`,
            value: 1800,
          },
          {
            label: `1 ${t('forms.notifications.invervals.hour')}`,
            value: 3600,
          },
          {
            label: `2 ${t('forms.notifications.invervals.hour')}`,
            value: 7200,
          },
          {
            label: `4 ${t('forms.notifications.invervals.hour')}`,
            value: 14_400,
          },
          {
            label: `6 ${t('forms.notifications.invervals.hour')}`,
            value: 21_600,
          },
          {
            label: `12 ${t('forms.notifications.invervals.hour')}`,
            value: 43_200,
          },
          {
            label: `24 ${t('forms.notifications.invervals.hour')}`,
            value: 86_400,
          },
        ]
      : [
          {
            label: t('forms.notifications.invervals.hourly'),
            value: 3600,
          },
          {
            label: t('forms.notifications.invervals.daily'),
            value: 86_400,
          },
          {
            label: t('forms.notifications.invervals.weekly'),
            value: 604_800,
          },
          {
            label: t('forms.notifications.invervals.monthly'),
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
  SelectProps<number> & {
    cooldownMode: boolean;
  }
> = ({ cooldownMode, className, disabled, ...props }) => {
  const [query, setQuery] = useState('');

  const options = useIntervalOptions(cooldownMode || false, query, props.value);

  return (
    <Select
      className={clsx('[&_.ant-select-selector]:!bg-black/20', className)}
      showArrow={!disabled}
      disabled={disabled}
      showSearch
      onSearch={setQuery}
      searchValue={query}
      autoClearSearchValue
      filterOption={false}
      options={options.map(option => ({
        label: option.label,
        value: option.value,
      }))}
      {...props}
    />
  );
};
