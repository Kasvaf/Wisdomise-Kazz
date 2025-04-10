/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useCoinDetails } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinLabels } from 'shared/CoinLabels';
import { Coin } from 'shared/Coin';
import Spinner from 'shared/Spinner';

export function CoinMainWidget({
  className,
  slug,
}: {
  className?: string;
  slug: string;
}) {
  const { t } = useTranslation('coin-radar');
  const coinDetails = useCoinDetails({ slug });

  const loading = coinDetails.isPending || coinDetails.isLoading;

  return (
    <div
      className={clsx(
        'rounded-md bg-v1-surface-l2 p-3',
        loading && 'flex items-center justify-center py-10',
        className,
      )}
    >
      {coinDetails.data?.symbol && (
        <>
          <div className="flex flex-nowrap items-center justify-between gap-2">
            <Coin
              coin={
                coinDetails.data?.symbol ?? {
                  slug: '',
                  abbreviation: '',
                  name: '',
                  categories: [],
                  logo_url: '',
                }
              }
              nonLink
            />
            <div className="flex flex-col items-end justify-center gap-px">
              <ReadableNumber
                value={coinDetails.data?.data?.current_price}
                label="$"
                className="text-base"
              />
              <DirectionalNumber
                className="text-xxs"
                value={coinDetails.data?.data?.price_change_percentage_24h}
                label="%"
                showSign
                showIcon
                suffix="(24h)"
              />
            </div>
          </div>
          <hr className="my-3 h-px w-full border-0 bg-white/10" />
          <div className="space-y-2">
            <p className="text-xs text-v1-content-primary">
              {t('common.wise_labels')}
            </p>
            <CoinLabels
              categories={coinDetails.data?.symbol.categories}
              networks={coinDetails.data?.networks}
              labels={coinDetails.data?.symbol_labels}
              coin={coinDetails.data?.symbol}
              security={coinDetails.data.security_data?.map(
                x => x.symbol_security,
              )}
            />
          </div>
        </>
      )}
      {loading && <Spinner className="!size-24" />}
    </div>
  );
}
