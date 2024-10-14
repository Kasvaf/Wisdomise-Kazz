import { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { track } from 'config/segment';
import { Onboarding } from 'shared/Onboarding';

export function CoinRadarOnboarding() {
  const sections = useMemo(
    () => [
      {
        title: <Trans i18nKey="onboarding.sec-1.title" ns="coin-radar" />,
        content: <Trans i18nKey="onboarding.sec-1.content" ns="coin-radar" />,
        video: 'HhfJnu8j91M',
      },
      {
        title: <Trans i18nKey="onboarding.sec-2.title" ns="coin-radar" />,
        content: <Trans i18nKey="onboarding.sec-2.content" ns="coin-radar" />,
      },
      {
        title: <Trans i18nKey="onboarding.sec-3.title" ns="coin-radar" />,
        content: <Trans i18nKey="onboarding.sec-3.content" ns="coin-radar" />,
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
          where: 'coin_radar',
          step: segmentKey,
        })
      }
    />
  );
}
