import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { track } from 'config/segment';
import { Onboarding } from 'shared/Onboarding';

export function AthenaOnboarding() {
  const { t } = useTranslation('athena');
  const sections = useMemo(
    () => [
      {
        title: t('onboarding.sec-1.title'),
        content: (
          <Trans i18nKey="onboarding.sec-1.content" ns="athena">
            <ol>
              <li>
                <h1>Crypto Savvy Assistant:</h1> Our chatbot is your on-demand
                crypto expert, with real-time access to hundreds of data
                sources.
              </li>
              <li>
                <h1> Flexible Queries:</h1> Use the ready-made prompts or craft
                your own questions to explore the vast world of cryptocurrency.
              </li>
            </ol>
            <br />
            Engage with our chatbot to navigate the complex crypto market with
            ease and confidence.
          </Trans>
        ),
      },
      {
        title: t('onboarding.sec-2.title'),
        content: (
          <Trans i18nKey="onboarding.sec-2.content" ns="athena">
            <ol>
              <li>
                <h1>Omni-Present Icon:</h1> Look for the chatbot icon at every
                corner of our website for swift assistance.
              </li>
              <li>
                <h1>Smart Integration:</h1> In future updates, expect
                personalized analysis and guidance on feature use and product
                journeys.
              </li>
            </ol>
            <br />
            Our chatbot evolves with you, offering quick access today and
            smarter insights tomorrow.
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
          where: 'chatbot',
          step: segmentKey,
        })
      }
    />
  );
}
