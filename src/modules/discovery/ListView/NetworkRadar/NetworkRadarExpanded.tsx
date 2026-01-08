import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import QuickBuySettings from 'modules/autoTrader/BuySellTrader/QuickBuy/QuickBuySettings';
import { useTranslation } from 'react-i18next';
import BlacklistManager from 'shared/BlacklistManager';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { useNetworkRadarStream } from './lib';
import { NCoinList } from './NCoinList';
import { NetworkRadarFilters } from './NetworkRadarFilters';

export function NetworkRadarExpanded({ className }: { className?: string }) {
  const { t } = useTranslation('network-radar');

  const {
    new_pairs: newPairs,
    final_stretch: finalStretch,
    migrated,
  } = useNetworkRadarStream();

  return (
    <div
      className={clsx(
        'grid h-full max-h-(--content-height) grid-cols-3 gap-3 overflow-hidden p-3',
        className,
      )}
    >
      <h2 className="col-span-3 flex items-center justify-start gap-1 text-base">
        {t('page.title')}
        <HoverTooltip title={t('page.info')}>
          <Icon className="size-5" name={bxInfoCircle} size={20} />
        </HoverTooltip>

        <BlacklistManager className="ml-auto" />
      </h2>

      <NCoinList
        dataSource={newPairs.data?.results ?? []}
        loading={newPairs.isLoading}
        source="new_pairs"
        title="New Pairs"
        titleSuffix={
          <div className="flex items-center">
            <QuickBuySettings className="mr-11" source="new_pairs" />
            <NetworkRadarFilters initialTab="new_pairs" searchShortcut />
          </div>
        }
      />
      <NCoinList
        dataSource={finalStretch.data?.results ?? []}
        loading={finalStretch.isLoading}
        source="final_stretch"
        title="Final Stretch"
        titleSuffix={
          <div className="flex items-center">
            <QuickBuySettings className="mr-11" source="final_stretch" />
            <NetworkRadarFilters initialTab="final_stretch" searchShortcut />
          </div>
        }
      />
      <NCoinList
        dataSource={migrated.data?.results ?? []}
        loading={migrated.isLoading}
        source="migrated"
        title="Migrated"
        titleSuffix={
          <div className="flex items-center">
            <QuickBuySettings className="mr-11" source="migrated" />
            <NetworkRadarFilters initialTab="migrated" searchShortcut />
          </div>
        }
      />
    </div>
  );
}
