import { useTranslation } from 'react-i18next';
import { type ReactNode, useState } from 'react';
import { clsx } from 'clsx';
import {
  type RsiMomentumConfirmation,
  useRsiMomentumConfirmations,
  type RsiMomentumConfirmationCombination,
} from 'api/market-pulse';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ButtonSelect } from 'shared/ButtonSelect';
import { Coin } from 'shared/Coin';
import {
  useConfirmationTabs,
  type ConfirmationType,
} from './useConfirmationTabs';
import { ConfirmationAnalysis } from './ConfirmationAnalysis';
import { ConfirmationInfoBadge } from './ConfirmationInfoBadge';
import { ConfirmationTimeframeBadge } from './ConfirmationTimeframeBadge';

function RsiMomentumConfirmationRow({
  value,
  className,
  combination,
}: {
  value: RsiMomentumConfirmation;
  className?: string;
  combination: RsiMomentumConfirmationCombination[];
}) {
  return (
    <div
      className={clsx(
        'flex w-full flex-col gap-4 rounded-xl bg-v1-surface-l3 p-5 mobile:p-3',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 mobile:flex-wrap">
        <Coin
          coin={value.symbol}
          className="text-xs"
          imageClassName="size-10 mobile:size-6"
        />
        <div className="flex items-center gap-6">
          <ConfirmationTimeframeBadge combination={combination} value={value} />
          <ConfirmationInfoBadge
            type={
              combination.includes('oversold') ||
              combination.includes('bullish_divergence')
                ? 'oversold'
                : 'overbought'
            }
            value={value}
          />
          <ConfirmationInfoBadge
            type={
              combination.includes('oversold') ||
              combination.includes('bullish_divergence')
                ? 'bullish_divergence'
                : 'bearish_divergence'
            }
            value={value}
          />
        </div>
      </div>
      <ConfirmationAnalysis value={value} />
    </div>
  );
}

export function RsiMomentumConfirmationWidget({
  className,
  type,
  headerActions,
}: {
  className?: string;
  type: ConfirmationType;
  headerActions?: ReactNode;
}) {
  const { t } = useTranslation('market-pulse');
  const tabs = useConfirmationTabs(type);
  const [selectedTabKey, setSelectedTabKey] = useState<string>(tabs[0].key);
  const selectedTab = tabs.find(row => row.key === selectedTabKey);
  if (!selectedTab) throw new Error('unexpected error');
  const title =
    type === 'bullish'
      ? t('indicator_list.rsi.momentum.bullish_momentum_confirmation')
      : t('indicator_list.rsi.momentum.bearish_momentum_confirmation');
  const info =
    type === 'bullish'
      ? t('indicator_list.rsi.momentum.bullish_momentum_confirmation_info')
      : t('indicator_list.rsi.momentum.bearish_momentum_confirmation_info');
  const rsiMomentumConfirmations = useRsiMomentumConfirmations({
    combination: selectedTab.combination,
  });

  return (
    <OverviewWidget
      className={clsx('h-[750px]', className)}
      title={title}
      info={info}
      headerClassName="flex-wrap !justify-start"
      headerActions={
        <>
          {headerActions && (
            <div className="flex grow justify-end">{headerActions}</div>
          )}
          <ButtonSelect
            className="w-full grow"
            value={selectedTabKey}
            onChange={setSelectedTabKey}
            options={tabs.map(tab => ({
              label: tab.title,
              value: tab.key,
            }))}
          />
        </>
      }
      loading={rsiMomentumConfirmations.isLoading}
      empty={rsiMomentumConfirmations.data?.results.length === 0}
    >
      <div className="flex flex-col items-start gap-3">
        {rsiMomentumConfirmations.data?.results.map(row => (
          <RsiMomentumConfirmationRow
            value={row}
            key={row.symbol.slug}
            combination={selectedTab.combination}
          />
        ))}
      </div>
    </OverviewWidget>
  );
}
