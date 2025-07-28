import { Helmet } from 'react-helmet-async';
import { formatNumber } from 'utils/numbers';
import { useUnifiedCoinDetails } from './useUnifiedCoinDetails';

export function CoinDetailsMeta({ slug }: { slug: string }) {
  const { data } = useUnifiedCoinDetails({ slug });
  const coinName = data?.symbol
    ? `${data?.symbol.name ?? '---'}${
        (data?.symbol.abbreviation ?? '---').toLowerCase() ===
        (data?.symbol.name ?? '---').toLowerCase()
          ? ''
          : ` (${data?.symbol.abbreviation ?? '---'})`
      }`
    : '';

  const livePrice =
    typeof data?.marketData?.current_price === 'number'
      ? `${formatNumber(data?.marketData?.current_price, {
          compactInteger: true,
          decimalLength: 2,
          minifyDecimalRepeats: true,
          separateByComma: true,
        })} USDT`
      : 'unknown';
  /* eslint-disable i18next/no-literal-string */
  return (
    <Helmet>
      {coinName && (
        <>
          <title>
            {coinName} Live Price + Indicators, Prediction, Analysis
          </title>
          <meta
            name="description"
            content={`${coinName}'s live price is ${livePrice} | You're planning to buy or sell ${coinName}? Check the indicators and charts and find out analysis, signals and AI-powered predictions for ${coinName} provided by Wisdomise`}
          />
        </>
      )}
    </Helmet>
  );
}
