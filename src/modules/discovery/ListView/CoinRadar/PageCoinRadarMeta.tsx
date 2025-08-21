import { Helmet } from 'react-helmet-async';

export function PageCoinRadarMeta() {
  const currentYear = new Date().getFullYear().toString();
  /* eslint-disable i18next/no-literal-string */
  return (
    <Helmet>
      <title>
        Realtime List of Best Coins to Buy Right Now & in {currentYear}
      </title>
      <meta
        content="Check the realtime list of top crypto coins including trending coins, gems, memcoins, ... with analysis and predictions. Don't miss the next pumps and trends."
        name="description"
      />
    </Helmet>
  );
}
