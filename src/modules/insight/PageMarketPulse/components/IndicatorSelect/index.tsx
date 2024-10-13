import { type SVGProps, useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonSelect } from 'shared/ButtonSelect';
import { PageTitle } from 'shared/PageTitle';
import { ReactComponent as RsiIcon } from './rsi.svg';
import { ReactComponent as MacdIcon } from './macd.svg';

export type MarketPulseIndicators = 'rsi' | 'macd' | 'advanced';

export const IndicatorSelect: FC<{
  onChange: (newValue: MarketPulseIndicators) => void;
  value: MarketPulseIndicators;
}> = ({ onChange, value }) => {
  const { t } = useTranslation('market-pulse');
  const {
    title,
    description,
    icon: Icon,
  } = useMemo<{
    title?: string;
    description?: string;
    icon?: FC<SVGProps<SVGSVGElement>>;
  }>(() => {
    if (value === 'rsi') {
      return {
        title: t('indicator_list.rsi.label'),
        description: t('indicator_list.rsi.subtitle'),
        icon: RsiIcon,
      };
    }
    if (value === 'macd') {
      return {
        title: t('indicator_list.macd.label'),
        description: t('indicator_list.macd.subtitle'),
        icon: MacdIcon,
      };
    }
    throw new Error(`${value} indicator is not supported!`);
  }, [value, t]);

  return (
    <>
      <ButtonSelect
        options={[
          {
            label: t('indicator_list.rsi.label'),
            value: 'rsi',
          },
          {
            label: t('indicator_list.macd.label'),
            value: 'macd',
          },
          {
            label: (
              <>
                {t('indicator_list.advanced.label')}
                <span className="ms-2 text-xs font-light opacity-80">
                  {t('common:soon')}
                </span>
              </>
            ),
            value: 'advanced',
            disabled: true,
          },
        ]}
        value={value}
        onChange={newKey => onChange?.(newKey as MarketPulseIndicators)}
      />
      <div className="flex max-w-full flex-nowrap items-start justify-between gap-8 mobile:items-center mobile:gap-2">
        <PageTitle title={title} description={description} />
        {Icon && <Icon className="shrink-0 basis-auto mobile:basis-1/3" />}
      </div>
    </>
  );
};
