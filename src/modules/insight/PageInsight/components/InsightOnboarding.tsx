import { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { track } from 'config/segment';
import { Onboarding } from 'shared/Onboarding';

export function InsightOnboarding() {
  const sections = useMemo(
    () => [
      {
        title: <Trans i18nKey="onboarding.sec-1.title" ns="insight" />,
        content: <Trans i18nKey="onboarding.sec-1.content" ns="insight" />,
      },
      {
        title: <Trans i18nKey="onboarding.sec-2.title" ns="insight" />,
        content: <Trans i18nKey="onboarding.sec-2.content" ns="insight" />,
      },
      {
        title: <Trans i18nKey="onboarding.sec-3.title" ns="insight" />,
        content: <Trans i18nKey="onboarding.sec-3.content" ns="insight" />,
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
          where: 'insight_overview',
          step: segmentKey,
        })
      }
    />
  );
}
