import { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { track } from 'config/segment';
import { Onboarding } from 'shared/Onboarding';

export function WhalesOnboarding() {
  const sections = useMemo(
    () => [
      {
        title: <Trans i18nKey="onboarding.sec-1.title" ns="whale" />,
        content: <Trans i18nKey="onboarding.sec-1.content" ns="whale" />,
      },
      {
        title: <Trans i18nKey="onboarding.sec-2.title" ns="whale" />,
        content: <Trans i18nKey="onboarding.sec-2.content" ns="whale" />,
      },
      {
        title: <Trans i18nKey="onboarding.sec-3.title" ns="whale" />,
        content: <Trans i18nKey="onboarding.sec-3.content" ns="whale" />,
      },
      {
        title: <Trans i18nKey="onboarding.sec-4.title" ns="whale" />,
        content: <Trans i18nKey="onboarding.sec-4.content" ns="whale" />,
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
