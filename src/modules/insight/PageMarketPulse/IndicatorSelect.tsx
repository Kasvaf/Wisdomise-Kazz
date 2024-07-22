import { clsx } from 'clsx';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonSelect } from 'shared/ButtonSelect';

type Indicator = 'rsi' | 'macd';

export const IndicatorSelect: FC<{
  className?: string;
  onChange: (newValue: Indicator) => void;
  value: Indicator;
}> = ({ className, onChange, value }) => {
  const { t } = useTranslation('market-pulse');
  return (
    <div
      className={clsx(
        'flex items-center justify-start gap-4 border-b border-b-white/10 pb-4',
        className,
      )}
    >
      <h3 className="text-base font-normal">{t('indicators')}:</h3>
      <ButtonSelect
        options={[
          {
            label: t('indicator_list.rsi.label'),
            value: 'rsi',
          },
          {
            label: (
              <>
                {t('indicator_list.macd.label')}
                <span className="ms-2 text-xs font-light opacity-60">
                  {t('indicator_list.macd.soon')}
                </span>
              </>
            ),
            value: 'macd',
            disabled: true,
          },
        ]}
        buttonClassName="h-10 text-base px-6 !rounded-full disabled:!text-white/50"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
