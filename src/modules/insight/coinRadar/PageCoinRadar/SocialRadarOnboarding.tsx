/* eslint-disable react/no-unescaped-entities */
/* eslint-disable i18next/no-literal-string */
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { track } from 'config/segment';
import { Onboarding } from 'shared/Onboarding';

export function CoinRadarOnboarding() {
  const { t } = useTranslation('coin-radar');

  const sections = useMemo(
    () => [
      {
        title: t('onboarding.sec-1.title'),
        content: (
          <Trans i18nKey="onboarding.sec-1.content" ns="coin-radar">
            Embark on a social exploration with our AI-driven Social Scanner.
            Our introductory video will guide you through the buzzing world of
            social media trends and sentiments toward the hottest coins. Stay
            one step ahead with insights from top traders and the crypto
            community.
          </Trans>
        ),
      },
      {
        title: t('onboarding.sec-2.title'),
        content: (
          <Trans i18nKey="onboarding.sec-2.content" ns="coin-radar">
            <ol>
              <li>
                <h1>Heat Map of Trends:</h1> Spot the hottest and most discussed
                coins in the last 24 hours.
              </li>
              <li>
                <h1>Sentiment Analysis:</h1> Gauge the mood with our AI's
                sentiment breakdown for each trending coin. Dive into the social
                currents of crypto with data that doesn't sleep.
              </li>
            </ol>
          </Trans>
        ),
      },
      {
        title: t('onboarding.sec-3.title'),
        content: (
          <Trans i18nKey="onboarding.sec-3.content" ns="coin-radar">
            <ol>
              <li>
                <h1>Focused Exploration:</h1> Delve into specific conversations
                and see what people are saying about your coin of interest.
              </li>
              <li>
                <h1>Community-Driven Data:</h1> Suggest new Telegram channels or
                X/Reddit handles for us to scan. Help us help you by shaping the
                Social Scanner with your preferred sources.
              </li>
            </ol>
            <br />
            Harness the collective intelligence of the crypto community to
            inform your trading strategy.
          </Trans>
        ),
      },
    ],
    [t],
  );
  return (
    <Onboarding
      sections={sections}
      onIntract={segmentKey =>
        track('Click On', {
          place: 'wizard',
          where: 'coin_radar',
          step: segmentKey,
        })
      }
    />
  );
}
