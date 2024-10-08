import { useState } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { ButtonSelect } from 'shared/ButtonSelect';
import { type Indicator } from 'api/market-pulse';
import { RsiHeatmapWidget } from './RsiHeatmapWidget';
import { ConfirmationWidget } from './ConfirmationWidget';
import { type ConfirmationType } from './ConfirmationWidget/useConfirmationTabs';

export function TabContent<I extends Indicator>({
  indicator,
}: {
  indicator: I;
}) {
  const { t } = useTranslation('market-pulse');
  const [mobileTab, setMobileTab] = useState<ConfirmationType>('bullish');
  return (
    <div className="grid grid-cols-2 gap-6">
      {indicator === 'rsi' && <RsiHeatmapWidget className="col-span-full" />}
      <ButtonSelect
        className="col-span-full hidden !h-auto mobile:flex [&>button]:!whitespace-normal [&>button]:py-2"
        value={mobileTab}
        onChange={setMobileTab}
        options={[
          {
            label: t('common.bullish_momentum_confirmation'),
            value: 'bullish',
          },
          {
            label: t('common.bearish_momentum_confirmation'),
            value: 'bearish',
          },
        ]}
      />
      <ConfirmationWidget
        indicator={indicator}
        className={clsx(
          'col-span-1 mobile:col-span-2',
          mobileTab !== 'bullish' && 'mobile:hidden',
        )}
        type="bullish"
      />
      <ConfirmationWidget
        indicator={indicator}
        className={clsx(
          'col-span-1 mobile:col-span-2',
          mobileTab !== 'bearish' && 'mobile:hidden',
        )}
        type="bearish"
      />
    </div>
  );
}
