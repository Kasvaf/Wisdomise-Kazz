/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useCoinDetails, useNCoinDetails } from 'api';
import { CoinLabels } from 'shared/CoinLabels';

export function CoinLabelsWidget({
  className,
  slug,
  hr,
}: {
  className?: string;
  slug: string;
  hr?: boolean;
}) {
  const { t } = useTranslation('coin-radar');
  const coinDetails = useCoinDetails({ slug });

  const nCoinDetails = useNCoinDetails({ slug });

  const loading = coinDetails.isPending || coinDetails.isLoading;

  const hasLabel =
    coinDetails.data?.symbol.categories ||
    coinDetails.data?.networks ||
    coinDetails.data?.symbol_labels ||
    coinDetails.data?.security_data;

  if ((!loading && !hasLabel) || nCoinDetails.data) return null;

  return (
    <>
      <div
        className={clsx(
          'space-y-2 rounded-md bg-v1-surface-l2 p-3',
          loading && 'animate-pulse pb-8',
          className,
        )}
      >
        <p className="text-xs text-v1-content-primary">
          {t('common.wise_labels')}
        </p>
        {coinDetails.data?.symbol && (
          <>
            <CoinLabels
              categories={coinDetails.data?.symbol.categories}
              networks={coinDetails.data?.networks}
              labels={coinDetails.data?.symbol_labels}
              coin={coinDetails.data?.symbol}
              security={coinDetails.data.security_data?.map(
                x => x.symbol_security,
              )}
            />
          </>
        )}
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
