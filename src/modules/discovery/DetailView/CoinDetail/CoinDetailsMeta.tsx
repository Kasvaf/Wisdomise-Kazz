import { useEnrichedSwaps } from 'modules/autoTrader/useEnrichedSwaps';
import { useActiveNetwork } from 'modules/base/active-network';
import { Helmet } from 'react-helmet-async';
import { formatNumber } from 'utils/numbers';
import { useUnifiedCoinDetails } from './lib';

export function CoinDetailsMeta() {
  const { symbol, marketData } = useUnifiedCoinDetails();
  const network = useActiveNetwork();
  const asset = symbol.contractAddress!;
  const swaps = useEnrichedSwaps({
    asset,
    network,
  });
  const abbreviation = symbol.abbreviation;
  const lastSwap = swaps.data[0];
  const dir = lastSwap?.fromAsset === asset ? 'sell' : 'buy';
  const mc =
    +(
      (dir === 'sell' ? lastSwap?.fromAssetPrice : lastSwap?.toAssetPrice) ??
      '0'
    ) * (marketData.totalSupply ?? 0);

  return (
    <Helmet>
      <>
        <title>
          {lastSwap
            ? `${abbreviation} ${dir === 'buy' ? '↑' : '↓'} $${formatNumber(
                mc,
                {
                  compactInteger: true,
                  decimalLength: 2,
                  minifyDecimalRepeats: false,
                  exactDecimal: true,
                  separateByComma: false,
                },
              )} | GoatX`
            : 'GoatX'}
        </title>
      </>
    </Helmet>
  );
}
