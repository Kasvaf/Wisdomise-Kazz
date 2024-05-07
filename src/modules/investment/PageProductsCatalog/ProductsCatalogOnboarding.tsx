/* eslint-disable react/no-unescaped-entities */
/* eslint-disable i18next/no-literal-string */
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Onboarding } from 'shared/Onboarding';

export function ProductsCatalogOnboarding() {
  const { t } = useTranslation('products');
  const sections = useMemo(
    () => [
      {
        title: t('onboarding.sec-1.title'),
        content: (
          <Trans i18nKey="onboarding.sec-1.content" ns="products">
            Step into the world of automated trading with our AI-Driven Auto
            Trader. The video will reveal how our AI utilizes trend analysis and
            market data to manage your investments. Lock in your assets for at
            least three months to harness optimum performance. Discover our
            complimentary 'High-Risk Master' product, or explore further with an
            'Investment subscription' for access to our full suite of financial
            products.
          </Trans>
        ),
      },
      {
        title: t('onboarding.sec-2.title'),
        content: (
          <Trans i18nKey="onboarding.sec-2.content" ns="products">
            <ol>
              <li>
                <h1>Specialized Products:</h1> Engage with financial products
                designed for specific cryptocurrencies.
              </li>
              <li>
                <h1>Risk & APY:</h1> Balance your risk tolerance with the
                anticipated APY range of each product.
              </li>
            </ol>
          </Trans>
        ),
      },
      {
        title: t('onboarding.sec-3.title'),
        content: (
          <Trans i18nKey="onboarding.sec-3.content" ns="products">
            <ol>
              <li>
                <h1>Exchange Connection:</h1> Seamlessly connect your exchange
                account using your API key.
              </li>
              <li>
                <h1>Product Activation:</h1> Follow our detailed video guide to
                activate your chosen financial product by adding your exchange
                wallet. Easily kickstart your auto trading journey with our
                step-by-step activation process.
              </li>
              <li>Video box for explaining how to connect their binance API</li>
            </ol>
          </Trans>
        ),
      },
      {
        title: t('onboarding.sec-4.title'),
        content: (
          <Trans i18nKey="onboarding.sec-4.content" ns="products">
            <ol>
              <li>
                <h1>Asset Overview Access:</h1> Once activated, monitor your
                financial product's performance in the Asset Overview section.
              </li>
              <li>
                <h1>Profit/Loss Updates:</h1> Stay informed with real-time P/L
                updates.
              </li>
              <li>
                <h1>Position History:</h1> Review the trade history to
                understand your product’s market moves. Keep a close eye on your
                investments and make informed decisions with comprehensive
                insights.
              </li>
            </ol>
          </Trans>
        ),
      },
    ],
    [t],
  );
  return <Onboarding sections={sections} />;
}
