import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { bxShareAlt } from 'boxicons-quasar';
import { useCoinDetails } from 'api';
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
import { PriceAlertButton } from './PriceAlertButton';

export function CoinPriceWidget({
  className,
  slug,
}: {
  className?: string;
  slug: string;
}) {
  const { t } = useTranslation('coin-radar');
  const coinOverview = useCoinDetails({ slug });
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
          block
          className="w-full"
          size="xl"
          allowClear={false}
          onChange={newSlug => navigate(`/coin/${newSlug ?? 'bitcoin'}`)}
        />
        <HoverTooltip title={t('common:share-page-url')}>
          <Button
            onClick={() => share(location.href)}
            variant="ghost"
            size="xl"
            className="w-xl shrink-0"
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
      {coinOverview.data?.symbol && (
        <div className="mt-6 space-y-2">
          <p className="text-xs text-v1-content-primary">
            {t('common.labels')}
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
      <div className="mt-8 flex w-full gap-2">
        <PriceAlertButton className="shrink-0 grow" slug={slug} />
        <BtnAutoTrade className="shrink-0 grow" slug={slug} />
      </div>
    </OverviewWidget>
  );
}
