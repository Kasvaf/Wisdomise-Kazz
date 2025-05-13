import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { bxSlider } from 'boxicons-quasar';
import { useHasFlag, useCoinDetails } from 'api';
import { BtnAutoTrade } from 'modules/autoTrader/BtnAutoTrade';
import { DrawerModal } from 'shared/DrawerModal';
import { Coin } from 'shared/Coin';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { CoinLabels } from 'shared/CoinLabels';
import Spinner from 'shared/Spinner';
import { useAppRouteMeta } from 'modules/app/lib';
import { PriceAlertButton } from '../../DetailView/CoinDetail/PriceAlertButton';

const MiniAppPreDetailModal: React.FC<{
  slug?: string;
  onClose: () => unknown;
}> = ({ slug: slugArg, onClose }) => {
  const { t } = useTranslation('insight');
  const hasFlag = useHasFlag();
  const [slug, setSlug] = useState(slugArg);
  const isOpen = !!slug && !!slugArg;
  const { getUrl } = useAppRouteMeta();
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
          title={
            <Coin
              coin={coinOverview.data?.symbol ?? symbolPlaceholder}
              imageClassName="size-6"
              nonLink={true}
              truncate={250}
            />
          }
          open={isOpen}
          onClose={onClose}
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
                      symbol={tradingViewChartId}
                      style="1"
                      interval="60"
                      hotlist={false}
                      theme="dark"
                      height={370}
                      width="100%"
                      disabled_features={[
                        'timeframes_toolbar',
                        'chart_zoom',
                        'chart_scroll',
                      ]}
                      hide_side_toolbar
                      hide_top_toolbar
                      hide_legend
                      copyrightStyles={{ parent: { display: 'none' } }}
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
                  coin={coinOverview.data?.symbol ?? symbolPlaceholder}
                />
              </div>

              <div className="flex flex-col items-stretch gap-4">
                <div className="flex gap-3">
                  <NavLink
                    to={getUrl({
                      detail: 'coin',
                      slug,
                    })}
                    className="block basis-1/2"
                  >
                    <Button
                      variant="outline"
                      surface={2}
                      size="sm"
                      block
                      className="w-full"
                    >
                      <Icon name={bxSlider} />
                      {t('pre_detail_modal.details')}
                    </Button>
                  </NavLink>
                  <PriceAlertButton
                    variant="outline"
                    surface={2}
                    size="sm"
                    className="basis-1/2"
                    slug={slug}
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
