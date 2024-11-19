import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { bxCopy } from 'boxicons-quasar';
import { useCoinOverview } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import { OverviewWidget } from 'shared/OverviewWidget';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinLabels } from 'shared/CoinLabels';
import { useClipboardCopy } from 'shared/useClipboardCopy';
import Icon from 'shared/Icon';
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
  const [copyLink, copyLinkContent] = useClipboardCopy();

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
        <button
          onClick={() => copyLink(location.href)}
          className="flex size-12 items-center justify-center rounded-lg bg-black/20 transition-all hover:brightness-110 active:brightness-90"
        >
          <Icon size={21} name={bxCopy} />
        </button>
        {copyLinkContent}
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
          labels={coinOverview.data?.symbol_labels}
        />
      </div>
      <div className="mt-8">
        <PriceAlertButton slug={slug} className="w-full" />
      </div>
    </OverviewWidget>
  );
}
