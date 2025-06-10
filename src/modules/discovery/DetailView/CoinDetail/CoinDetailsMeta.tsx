import { Helmet } from 'react-helmet-async';
import { useCoinDetails } from 'api/discovery';
import { formatNumber } from 'utils/numbers';

export function CoinDetailsMeta({ slug }: { slug: string }) {
  const coinOverview = useCoinDetails({ slug });
  const coinName = coinOverview.data?.symbol
    ? `${coinOverview.data?.symbol.name ?? '---'}${
        (coinOverview.data?.symbol.abbreviation ?? '---').toLowerCase() ===
        (coinOverview.data?.symbol.name ?? '---').toLowerCase()
          ? ''
          : ` (${coinOverview.data?.symbol.abbreviation ?? '---'})`
      }`
    : '';

  const livePrice =
    typeof coinOverview.data?.data?.current_price === 'number'
      ? `${formatNumber(coinOverview.data?.data?.current_price, {
          compactInteger: true,
          decimalLength: 2,
          minifyDecimalRepeats: true,
          seperateByComma: true,
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
