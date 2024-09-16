import { useTranslation } from 'react-i18next';
import { type ReactNode, useState } from 'react';
import { clsx } from 'clsx';
import {
  type RsiMomentumConfirmation,
  useRsiMomentumConfirmations,
  type RsiMomentumConbination,
} from 'api/market-pulse';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ButtonSelect } from 'shared/ButtonSelect';
import { Coin } from 'shared/Coin';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import { useMomentumTabs, type MomentumType } from './useMomentumTabs';
import { MomentumResolutionStats } from './MomentumResolutionStats';
import { MomentumDetailsTable } from './MomentumDetailsTable';
import { MomentumAnalysis } from './MomentumAnalysis';
import { ExpandButton } from './ExpandButton';

function RsiMomentumConfirmationRow({
  value,
  className,
  combination,
}: {
  value: RsiMomentumConfirmation;
  className?: string;
  combination: RsiMomentumConbination[];
}) {
  const { t } = useTranslation('market-pulse');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={clsx(
        'flex w-full flex-col gap-4 rounded-xl bg-v1-surface-l3 p-5 mobile:p-3',
        className,
      )}
    >
      <div className="grid grid-cols-12 items-start justify-start gap-4 mobile:flex-wrap">
        <div className="col-span-4 mobile:col-span-12">
          <Coin
            coin={value.symbol}
            className="text-xs"
            imageClassName="size-6"
          />
        </div>
        <div className="contents flex-row items-center justify-between gap-2 mobile:col-span-12 mobile:flex">
          <div className="col-span-3 flex flex-col justify-between gap-px">
            <p className="text-xxs text-v1-content-secondary">
              {t('common.price')}
            </p>
            <ReadableNumber
              className="text-sm"
              value={value.data.current_price}
              label="usdt"
            />
          </div>
          <div className="col-span-5 flex flex-col justify-between gap-px">
            <p className="text-xxs text-v1-content-secondary">
              {t('common.price_change')}
            </p>
            <div className="flex items-center gap-2">
              <ReadableNumber
                className="text-sm mobile:hidden"
                value={value.data.price_change_24h}
                label="usdt"
              />
              <PriceChange
                textClassName="!text-xs"
                value={value.data.price_change_percentage_24h}
                suffix=" (24H)"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="h-px bg-v1-content-primary/5" />
      <MomentumResolutionStats combination={combination} value={value} />
      <div className="h-px bg-v1-content-primary/5" />
      {isOpen && <MomentumDetailsTable value={value} />}
      {isOpen && <MomentumAnalysis value={value} />}
      <div className="flex justify-center">
        <ExpandButton value={isOpen} onClick={() => setIsOpen(p => !p)} />
      </div>
    </div>
  );
}

export function RsiMomentumConfirmationWidget({
  className,
  type,
  headerActions,
}: {
  className?: string;
  type: MomentumType;
  headerActions?: ReactNode;
}) {
  const { t } = useTranslation('market-pulse');
  const tabs = useMomentumTabs(type);
  const [selectedTabKey, setSelectedTabKey] = useState<string>(tabs[0].key);
  const selectedTab = tabs.find(row => row.key === selectedTabKey);
  if (!selectedTab) throw new Error('unexpected error');
  const title =
    type === 'bullish'
      ? t('indicator_list.rsi.momentum.bullish_momentum_confirmation')
      : t('indicator_list.rsi.momentum.bearish_momentum_confirmation');
  const rsiMomentumConfirmations = useRsiMomentumConfirmations({
    combination: selectedTab.combination,
  });

  return (
    <OverviewWidget
      className={clsx('h-[750px]', className)}
      title={title}
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
      <p className="text-xs text-v1-content-secondary">
        {selectedTab.description}
      </p>
      <div className="mt-4 flex flex-col items-start gap-3">
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
