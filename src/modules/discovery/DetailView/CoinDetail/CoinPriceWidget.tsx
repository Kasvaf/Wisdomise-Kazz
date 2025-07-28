/* eslint-disable import/max-dependencies */
import { useMemo, type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { bxShareAlt } from 'boxicons-quasar';

import { DirectionalNumber } from 'shared/DirectionalNumber';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { useShare } from 'shared/useShare';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { ReadableNumber } from 'shared/ReadableNumber';
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
    return `${window.location.origin}/coin/${slug}`;
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
              <p className="text-xxs text-v1-content-secondary">{'Price'}</p>
              <DirectionalNumber
                value={data?.marketData.current_price}
                label="$"
                direction="up"
                className="text-sm"
                showIcon={false}
                showSign={false}
              />

              <p className="text-xxs text-v1-content-secondary">{'MC'}</p>
              <ReadableNumber
                value={data?.marketData.market_cap}
                label="$"
                className="text-base"
                format={{
                  decimalLength: 1,
                }}
              />
            </div>
            <div className="flex items-center justify-end gap-1">
              <PriceAlertButton
                slug={slug}
                variant="outline"
                surface={1}
                size="sm"
                fab
              />
              <Button
                surface={1}
                size="sm"
                fab
                variant="outline"
                onClick={() => share(pageUrl)}
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
