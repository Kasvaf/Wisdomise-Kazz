import { bxShareAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DirectionalNumber } from 'shared/DirectionalNumber';
import Icon from 'shared/Icon';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';
import { PriceAlertButton } from './PriceAlertButton';
import { useUnifiedCoinDetails } from './useUnifiedCoinDetails';

export const CoinPriceWidget: FC<{
  slug: string;
  className?: string;
  hr?: boolean;
}> = ({ slug, className, hr }) => {
  const { t } = useTranslation('network-radar');
  const [globalNetwork] = useGlobalNetwork();
  const { isLoading, data } = useUnifiedCoinDetails({ slug });

  const [share, shareNotif] = useShare('copy');

  const pageUrl = useMemo(() => {
    const network = globalNetwork
      ? data?.networks.find(n => n.network.slug === globalNetwork)
      : data?.networks[0];
    if (network?.contract_address) {
      return `${window.location.origin}/token/${network.network.slug}/${network.contract_address}`;
    }
    return `${window.location.origin}/token/${slug}`;
  }, [globalNetwork, data, slug]);

  useLoadingBadge(isLoading);

  return (
    <>
      <div
        className={clsx(
          'flex items-center justify-between gap-1 overflow-auto',
          className,
        )}
      >
        {data?.symbol ? (
          <>
            <div className="grid grow grid-flow-col grid-rows-[1rem_auto] gap-px">
              <p className="text-v1-content-secondary text-xxs">{'Price'}</p>
              <DirectionalNumber
                className="text-sm"
                direction="up"
                label="$"
                showIcon={false}
                showSign={false}
                value={data?.marketData.current_price}
              />

              <p className="text-v1-content-secondary text-xxs">{'MC'}</p>
              <ReadableNumber
                className="text-base"
                format={{
                  decimalLength: 1,
                }}
                label="$"
                value={data?.marketData.market_cap}
              />
            </div>
            <div className="flex items-center justify-end gap-1">
              <PriceAlertButton
                fab
                size="sm"
                slug={slug}
                surface={1}
                variant="outline"
              />
              <Button
                fab
                onClick={() => share(pageUrl)}
                size="sm"
                surface={1}
                variant="outline"
              >
                <Icon name={bxShareAlt} />
              </Button>
              {shareNotif}
            </div>
          </>
        ) : (
          <p className="w-full animate-pulse text-center text-sm">
            {t('common:almost-there')}
          </p>
        )}
      </div>
      {hr && data?.symbol && <hr className="border-white/10" />}
    </>
  );
};
