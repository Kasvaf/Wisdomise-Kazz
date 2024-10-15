import { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { track } from 'config/segment';
import { Onboarding } from 'shared/Onboarding';

export function MarketPulseOnboarding() {
  const sections = useMemo(
    () => [
      {
        title: <Trans i18nKey="onboarding.sec-1.title" ns="market-pulse" />,
        content: <Trans i18nKey="onboarding.sec-1.content" ns="market-pulse" />,
      },
      {
        title: <Trans i18nKey="onboarding.sec-2.title" ns="market-pulse" />,
        content: <Trans i18nKey="onboarding.sec-2.content" ns="market-pulse" />,
      },
      {
        title: <Trans i18nKey="onboarding.sec-3.title" ns="market-pulse" />,
        content: <Trans i18nKey="onboarding.sec-3.content" ns="market-pulse" />,
      },
      {
        title: <Trans i18nKey="onboarding.sec-4.title" ns="market-pulse" />,
        content: <Trans i18nKey="onboarding.sec-4.content" ns="market-pulse" />,
      },
    ],
    [],
  );
  return (
    <Onboarding
      sections={sections}
      onIntract={segmentKey =>
        track('Click On', {
          place: 'wizard',
          where: 'market_pulse',
          step: segmentKey,
        })
      }
    />
  );
}
