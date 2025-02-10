import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { useCoinDetails, useHasFlag } from 'api';
import { PriceAlertButton } from 'modules/insight/PageCoinDetails/components/PriceAlertButton';
import Button from 'shared/Button';
import { DrawerModal } from 'shared/DrawerModal';
import { useSymbolInfo } from 'api/symbol';
import { Coin } from 'shared/Coin';

const CoinPreDetailModal: React.FC<{
  slug: string;
  onClose: () => unknown;
}> = ({ slug, onClose }) => {
  const hasFlag = useHasFlag();
  const { data: coinOverview } = useCoinDetails({ slug });
  const { data: symbol } = useSymbolInfo(slug);
  const tradingViewChartId = coinOverview?.charts.find(
    x => x.type === 'trading_view',
  )?.id;
  if (!slug) return null;

  return (
    <DrawerModal
      title={
        symbol && <Coin coin={symbol} imageClassName="size-6" nonLink={true} />
      }
      open={!!slug}
      onClose={onClose}
    >
      {hasFlag('/trader-coin-chart') && tradingViewChartId && (
        <div className="-mx-1 -mt-4 mb-3">
          <AdvancedRealTimeChart
            allow_symbol_change={false}
            symbol={tradingViewChartId}
            style="1"
            interval="60"
            hide_side_toolbar
            hotlist={false}
            theme="dark"
            height={350}
            width="100%"
            disabled_features={[
              'timeframes_toolbar',
              'chart_zoom',
              'chart_scroll',
            ]}
            hide_top_toolbar
            hide_legend
            copyrightStyles={{ parent: { display: 'none' } }}
          />
        </div>
      )}

      <div className="flex flex-col items-stretch gap-4">
        <div className="flex gap-3">
          <Button
            variant="secondary"
            to={`/trader-hot-coins/${slug}`}
            className="w-1/2 grow"
          >
            Overview
          </Button>
          <PriceAlertButton
            slug={slug}
            className="!h-auto w-1/2 grow"
            variant="white"
          />
        </div>
        <Button variant="brand" to={`/market/${slug}`}>
          Auto Trade
        </Button>
      </div>
    </DrawerModal>
  );
};

export default CoinPreDetailModal;
