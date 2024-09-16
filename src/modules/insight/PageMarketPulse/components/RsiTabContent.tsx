import { useState } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { ButtonSelect } from 'shared/ButtonSelect';
import { RsiHeatmapWidget } from './RsiHeatmapWidget';
import { RsiMomentumConfirmationWidget } from './RsiMomentumConfirmationWidget';
import { type MomentumType } from './RsiMomentumConfirmationWidget/useMomentumTabs';

export function RsiTabContent() {
  const { t } = useTranslation('market-pulse');
  const [mobileMomentumTab, setMobileMomentumTab] =
    useState<MomentumType>('bullish');
  return (
    <div className="grid grid-cols-2 gap-6">
      <RsiHeatmapWidget className="col-span-full" />
      <ButtonSelect
        className="col-span-full hidden !h-auto mobile:flex [&>button]:!whitespace-normal [&>button]:py-2"
        value={mobileMomentumTab}
        onChange={setMobileMomentumTab}
        options={[
          {
            label: t(
              'indicator_list.rsi.momentum.bullish_momentum_confirmation',
            ),
            value: 'bullish',
          },
          {
            label: t(
              'indicator_list.rsi.momentum.bearish_momentum_confirmation',
            ),
            value: 'bearish',
          },
        ]}
      />
      <RsiMomentumConfirmationWidget
        className={clsx(
          'col-span-1 mobile:col-span-2',
          mobileMomentumTab !== 'bullish' && 'mobile:hidden',
        )}
        type="bullish"
      />
      <RsiMomentumConfirmationWidget
        className={clsx(
          'col-span-1 mobile:col-span-2',
          mobileMomentumTab !== 'bearish' && 'mobile:hidden',
        )}
        type="bearish"
      />
    </div>
  );
}
