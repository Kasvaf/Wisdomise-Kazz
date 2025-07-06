/* eslint-disable import/max-dependencies */
import { useMemo, type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { bxShareAlt } from 'boxicons-quasar';
import {
  useCoinDetails,
  useNCoinDetails,
  type CoinNetwork,
} from 'api/discovery';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { useShare } from 'shared/useShare';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { ReadableNumber } from 'shared/ReadableNumber';
import { PriceAlertButton } from './PriceAlertButton';

export const CoinPriceWidget: FC<{
  slug: string;
  className?: string;
  hr?: boolean;
}> = ({ slug, className, hr }) => {
  const { t } = useTranslation('network-radar');
  const [globalNetwork] = useGlobalNetwork();
  const coin = useCoinDetails({ slug });
  const nCoin = useNCoinDetails({ slug });
  const [share, shareNotif] = useShare('copy');
  const isLoading =
    coin.isLoading || nCoin.isLoading || coin.isPending || nCoin.isPending;
  const symbol = nCoin.data?.base_symbol || coin.data?.symbol;

  const networks = useMemo<CoinNetwork[]>(() => {
    const ret: CoinNetwork[] = [];
    if (nCoin.data?.base_contract_address && nCoin.data.network) {
      return [
        {
          contract_address: nCoin.data.base_contract_address,
          symbol_network_type: 'TOKEN',
          network: nCoin.data.network,
        },
      ];
    }
    if (coin?.data?.networks) {
      return coin?.data?.networks;
    }
    return ret;
  }, [nCoin.data, coin.data]);

  const pageUrl = useMemo(() => {
    const network = globalNetwork
      ? networks.find(n => n.network.slug === globalNetwork)
      : networks[0];
    if (network?.contract_address) {
      return `${window.location.origin}/token/${network.network.slug}/${network.contract_address}`;
    }
    return `${window.location.origin}/coin/${slug}`;
  }, [globalNetwork, networks, slug]);

  useLoadingBadge(isLoading);

  return (
    <>
      <div
        className={clsx(
          'flex items-center justify-between gap-1 overflow-auto',
          className,
        )}
      >
        {symbol ? (
          <>
            <div className="grid grow grid-flow-col grid-rows-[1rem_auto] gap-px">
              <p className="text-xxs text-v1-content-secondary">{'Price'}</p>
              <DirectionalNumber
                value={
                  nCoin.data?.update.base_market_data.current_price ??
                  coin.data?.data?.current_price
                }
                label="$"
                direction="up"
                className="text-sm"
                showIcon={false}
                showSign={false}
              />

              <p className="text-xxs text-v1-content-secondary">{'MC'}</p>
              <ReadableNumber
                value={
                  nCoin.data?.update.base_market_data.market_cap ??
                  coin.data?.data?.market_cap
                }
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
      {hr && symbol && <hr className="border-white/10" />}
    </>
  );
};
