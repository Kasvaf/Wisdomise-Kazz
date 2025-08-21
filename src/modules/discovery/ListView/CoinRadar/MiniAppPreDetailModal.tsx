import { useHasFlag } from 'api';
import { useCoinDetails } from 'api/discovery';
import { bxSlider } from 'boxicons-quasar';
import { BtnAutoTrade } from 'modules/autoTrader/BtnAutoTrade';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { Coin } from 'shared/Coin';
import { CoinLabels } from 'shared/CoinLabels';
import { DrawerModal } from 'shared/DrawerModal';
import Icon from 'shared/Icon';
import Spinner from 'shared/Spinner';
import { Button } from 'shared/v1-components/Button';
import { PriceAlertButton } from '../../DetailView/CoinDetail/PriceAlertButton';

const MiniAppPreDetailModal: React.FC<{
  slug?: string;
  onClose: () => unknown;
}> = ({ slug: slugArg, onClose }) => {
  const { t } = useTranslation('insight');
  const hasFlag = useHasFlag();
  const [slug, setSlug] = useState(slugArg);
  const isOpen = !!slug && !!slugArg;
  const { getUrl } = useDiscoveryRouteMeta();
  useEffect(() => {
    if (slugArg) {
      setSlug(slugArg);
    }
  }, [slugArg]);

  const coinOverview = useCoinDetails({ slug });
  // coinOverview.isLoading = true;
  const tradingViewChartId = coinOverview.data?.charts.find(
    x => x.type === 'trading_view',
  )?.id;

  const symbolPlaceholder = {
    slug: slug ?? '',
    abbreviation: '...',
    name: '...',
  };

  // slug should be used for active network

  return (
    <>
      {slug && (
        <DrawerModal
          onClose={onClose}
          open={isOpen}
          title={
            <Coin
              coin={coinOverview.data?.symbol ?? symbolPlaceholder}
              imageClassName="size-6"
              nonLink={true}
              truncate={250}
            />
          }
        >
          {coinOverview.isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Spinner />
            </div>
          ) : (
            <>
              {hasFlag('/trader-coin-chart') && (
                <div className="-mx-1 -mt-4 mb-1 h-[350px]">
                  {tradingViewChartId && (
                    <AdvancedRealTimeChart
                      allow_symbol_change={false}
                      copyrightStyles={{ parent: { display: 'none' } }}
                      disabled_features={[
                        'timeframes_toolbar',
                        'chart_zoom',
                        'chart_scroll',
                      ]}
                      height={370}
                      hide_legend
                      hide_side_toolbar
                      hide_top_toolbar
                      hotlist={false}
                      interval="60"
                      style="1"
                      symbol={tradingViewChartId}
                      theme="dark"
                      width="100%"
                    />
                  )}
                </div>
              )}

              <div className="mb-4 flex flex-col items-start justify-end overflow-auto">
                <p className="mb-1 text-xxs">
                  {t('pre_detail_modal.wise_labels')}
                </p>
                <CoinLabels
                  categories={coinOverview.data?.symbol.categories}
                  labels={coinOverview.data?.symbol_labels}
                  networks={coinOverview.data?.networks}
                  security={coinOverview.data?.security_data?.map(
                    x => x.symbol_security,
                  )}
                />
              </div>

              <div className="flex flex-col items-stretch gap-4">
                <div className="flex gap-3">
                  <NavLink
                    className="block basis-1/2"
                    to={getUrl({
                      detail: 'coin',
                      view: 'both',
                      slug,
                    })}
                  >
                    <Button
                      block
                      className="w-full"
                      size="sm"
                      surface={2}
                      variant="outline"
                    >
                      <Icon name={bxSlider} />
                      {t('pre_detail_modal.details')}
                    </Button>
                  </NavLink>
                  <PriceAlertButton
                    className="basis-1/2"
                    size="sm"
                    slug={slug}
                    surface={2}
                    variant="outline"
                  />
                </div>
                <BtnAutoTrade slug={slug} variant="primary" />
              </div>
            </>
          )}
        </DrawerModal>
      )}
    </>
  );
};

export default MiniAppPreDetailModal;
