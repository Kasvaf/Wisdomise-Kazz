/* eslint-disable react/no-unescaped-entities */
/* eslint-disable i18next/no-literal-string */
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Onboarding } from 'shared/Onboarding';

export function CoinsOnboarding() {
  const { t } = useTranslation('strategy');

  const sections = useMemo(
    () => [
      {
        title: t('coins.onboarding.sec-1.title'),
        content: (
          <Trans i18nKey="coins.onboarding.sec-1.content" ns="strategy">
            Begin your personalized crypto journey in our Coin List section,
            complete with a dynamic video introduction. Explore signalers, set
            notifications, and visualize performance for each coin. Catch a
            preview of the power at your fingertip
          </Trans>
        ),
      },
      {
        title: t('coins.onboarding.sec-2.title'),
        content: (
          <Trans i18nKey="coins.onboarding.sec-2.content" ns="strategy">
            <ol>
              <li>
                <h1>Coin Selection:</h1> Discover the signalers available for
                your chosen cryptocurrency.
              </li>
              <li>
                <h1>Tailored Notifications:</h1> Configure Telegram alerts for
                immediate updates from each signaler.
              </li>
              <li>
                <h1>Exclusive Access:</h1> Enjoy full details of the Range
                Master signaler for Solana at no cost.
              </li>
            </ol>
            <br />
            Delve into the world of crypto with precision - your portfolio,
            personalized.
          </Trans>
        ),
      },
      {
        title: t('coins.onboarding.sec-3.title'),
        content: (
          <Trans i18nKey="coins.onboarding.sec-3.content" ns="strategy">
            <ol>
              <li>
                <h1>Signal Exploration:</h1> Click to explore each signaler's
                history with detailed open and closed positions and their P/L.
              </li>
              <li>
                <h1>Chart Visualization:</h1> See your potential profits and
                losses come to life on intuitive charts.
              </li>
              <li>
                <h1>Insight Subscription:</h1> Expand your horizon with premium
                access to all coins and signalers for informed decision-making.
              </li>
            </ol>
            <br />
            Your strategic edge in crypto, charted clearly with our Insight
            subscription.
          </Trans>
        ),
      },
    ],
    [t],
  );
  return <Onboarding sections={sections} />;
}
