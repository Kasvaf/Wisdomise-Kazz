import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { bxShareAlt } from 'boxicons-quasar';
import { useCoinOverview } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import { OverviewWidget } from 'shared/OverviewWidget';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinLabels } from 'shared/CoinLabels';
import { useShare } from 'shared/useShare';
import Icon from 'shared/Icon';
import { HoverTooltip } from 'shared/HoverTooltip';
import { Button } from 'shared/v1-components/Button';
import { PriceAlertButton } from '../PriceAlertButton';
import { CoinSelect } from './CoinSelect';

export function CoinPriceWidget({
  className,
  slug,
}: {
  className?: string;
  slug: string;
}) {
  const { t } = useTranslation('coin-radar');
  const coinOverview = useCoinOverview({ slug });
  const navigate = useNavigate();
  const [share, shareNotif] = useShare('share');

  return (
    <OverviewWidget
      className={clsx('min-h-[233px] mobile:min-h-[213px]', className)}
      loading={coinOverview.isLoading}
      empty={coinOverview.data?.data?.current_price === null}
    >
      <div className="flex flex-nowrap items-center gap-2">
        <CoinSelect
          value={slug}
          className="w-full text-base"
          onChange={newSlug => navigate(`/coin/${newSlug}`)}
        />
        <HoverTooltip title={t('common:share-page-url')}>
          <Button
            onClick={() => share(location.href)}
            variant="ghost"
            className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-black/20 transition-all hover:brightness-110 active:brightness-90"
          >
            <Icon size={21} name={bxShareAlt} />
          </Button>
        </HoverTooltip>
        {shareNotif}
      </div>
      <div className="mt-6 space-y-2">
        <p className="text-xs text-v1-content-primary">{t('common.price')}</p>
        <div className="flex items-end justify-between gap-2">
          <ReadableNumber
            value={coinOverview.data?.data?.current_price}
            label="$"
            className="shrink-0 text-4xl"
          />
          <DirectionalNumber
            className="text-sm"
            value={coinOverview.data?.data?.price_change_percentage_24h}
            label="%"
            showSign
            showIcon
            suffix="(24h)"
          />
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <p className="text-xs text-v1-content-primary">{t('common.labels')}</p>
        <CoinLabels
          categories={coinOverview.data?.symbol.categories}
          networks={coinOverview.data?.networks}
          labels={coinOverview.data?.symbol_labels}
        />
      </div>
      <div className="mt-8">
        <PriceAlertButton slug={slug} className="w-full" />
      </div>
    </OverviewWidget>
  );
}
