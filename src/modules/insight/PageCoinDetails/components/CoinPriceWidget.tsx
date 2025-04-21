/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { bxInfoCircle, bxShareAlt } from 'boxicons-quasar';
import { useState } from 'react';
import {
  useCoinDetails,
  useSocialRadarSentiment,
  useTechnicalRadarSentiment,
  useWhaleRadarSentiment,
} from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import { OverviewWidget } from 'shared/OverviewWidget';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinLabels } from 'shared/CoinLabels';
import { useShare } from 'shared/useShare';
import Icon from 'shared/Icon';
import { HoverTooltip } from 'shared/HoverTooltip';
import { Button } from 'shared/v1-components/Button';
import { CoinSelect } from 'shared/CoinSelect';
import { BtnAutoTrade } from 'modules/autoTrader/BtnAutoTrade';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import useIsMobile from 'utils/useIsMobile';
import { DrawerModal } from 'shared/DrawerModal';
import { PriceAlertButton } from './PriceAlertButton';
import { CoinStatsWidget } from './CoinStatsWidget';
import { CoinIntroductionWidget } from './CoinIntroductionWidget';

export function CoinPriceWidget({
  className,
  slug,
}: {
  className?: string;
  slug: string;
}) {
  const isMobile = useIsMobile();
  const { t } = useTranslation('coin-radar');
  const [expand, setExpand] = useState(false);
  const coinOverview = useCoinDetails({ slug });
  const socialRadarSentiment = useSocialRadarSentiment({ slug });
  const technicalRadarSentiment = useTechnicalRadarSentiment({ slug });
  const WhaleRadarSentiment = useWhaleRadarSentiment({ slug });
  const prices =
    socialRadarSentiment.data?.signals_analysis?.sparkline?.prices ??
    technicalRadarSentiment.data?.sparkline?.prices ??
    WhaleRadarSentiment.data?.chart_data?.map(x => ({
      value: x.price,
      related_at: x.related_at,
    })) ??
    []; // TODO Whale sentiment
  const navigate = useNavigate();
  const [share, shareNotif] = useShare('share');

  return (
    <OverviewWidget
      className={clsx(
        'min-h-[233px] mobile:min-h-[213px] mobile:!p-0',
        className,
      )}
      loading={coinOverview.isLoading}
      empty={coinOverview.data?.data?.current_price === null}
      surface={isMobile ? 0 : 1}
    >
      <div className="flex flex-nowrap items-center gap-2">
        <CoinSelect
          value={slug}
          block
          className="w-full"
          size="xl"
          allowClear={false}
          onChange={newSlug => navigate(`/coin/${newSlug ?? 'bitcoin'}`)}
          surface={isMobile ? 2 : 3}
        />
        <HoverTooltip title={t('common:share-page-url')}>
          <Button
            onClick={() => share(location.href)}
            variant="ghost"
            size="xl"
            className="w-xl shrink-0"
            surface={isMobile ? 2 : 3}
          >
            <Icon size={21} name={bxShareAlt} />
          </Button>
        </HoverTooltip>
        {shareNotif}
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs text-v1-content-primary">
              {t('common.price')}
            </p>
            <div className="flex items-center gap-1">
              <ReadableNumber
                value={coinOverview.data?.data?.current_price}
                label="$"
                className="shrink-0 text-base"
              />
              <DirectionalNumber
                className="text-xxs"
                value={coinOverview.data?.data?.price_change_percentage_24h}
                label="%"
                showSign
                showIcon
                suffix="(24h)"
              />
            </div>
          </div>
          <CoinPriceChart
            value={prices}
            height={60}
            width={isMobile ? 160 : 110}
          />
        </div>
      </div>
      <div className="mt-2 hidden items-center gap-2 mobile:flex">
        <div className="grow space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-v1-content-secondary">
              {t('coin-details.tabs.coin_stats.volume')}
            </p>
            <div className="space-x-1 text-xxs">
              <DirectionalNumber
                value={coinOverview.data?.data?.volume_change_percentage_24h}
                suffix=" (24h)"
                showIcon
                showSign
                label="%"
              />
              <ReadableNumber
                value={coinOverview.data?.data?.total_volume}
                label="$"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-v1-content-secondary">
              {t('coin-details.tabs.coin_stats.market_cap')}
            </p>
            <div className="space-x-1 text-xxs">
              <DirectionalNumber
                value={
                  coinOverview.data?.data?.market_cap_change_percentage_24h
                }
                suffix=" (24h)"
                showIcon
                showSign
                label="%"
              />
              <ReadableNumber
                value={coinOverview.data?.data?.market_cap}
                label="$"
              />
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          fab
          size="md"
          className="hidden shrink-0 mobile:inline-flex"
          surface={2}
          onClick={() => setExpand(true)}
        >
          <Icon name={bxInfoCircle} />
        </Button>
      </div>
      {coinOverview.data?.symbol && (
        <div className="mt-6 space-y-2">
          <p className="text-xs text-v1-content-primary">
            {t('common.wise_labels')}
          </p>
          <CoinLabels
            categories={coinOverview.data?.symbol.categories}
            networks={coinOverview.data?.networks}
            labels={coinOverview.data?.symbol_labels}
            coin={coinOverview.data?.symbol}
            security={coinOverview.data.security_data?.map(
              x => x.symbol_security,
            )}
          />
        </div>
      )}
      <div className="mt-8 flex w-full gap-2 ">
        <BtnAutoTrade className="shrink-0 grow" variant="primary" slug={slug} />
        <PriceAlertButton
          className="shrink-0 grow"
          slug={slug}
          variant="outline"
        />
      </div>
      <DrawerModal
        open={expand}
        onClose={() => setExpand(false)}
        closeIcon={null}
        className="[&_.ant-drawer-header]:hidden"
      >
        <p className="text-center text-base font-semibold">
          {t('common.info')}
        </p>
        <div className="space-y-2">
          <CoinStatsWidget slug={slug} />
          <div className="h-px bg-v1-content-secondary/30" />
          {/* <CoinLinksWidget slug={slug} /> */}
          <div className="h-px bg-v1-content-secondary/30" />
          <CoinIntroductionWidget slug={slug} />
        </div>
      </DrawerModal>
    </OverviewWidget>
  );
}
