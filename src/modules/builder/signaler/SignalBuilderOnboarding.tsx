/* eslint-disable react/no-unescaped-entities */
/* eslint-disable i18next/no-literal-string */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { track } from 'config/segment';
import { Onboarding } from 'shared/Onboarding';

export function SignalBuilderOnboarding() {
  const { t } = useTranslation('builder');

  const sections = useMemo(
    () => [
      {
        title: t('onboarding.signaler.page1.title'),
        content: <div>{t('onboarding.signaler.page1.description')}</div>,
      },
      {
        title: t('onboarding.signaler.page2.title'),
        content: <div>{t('onboarding.signaler.page2.description')}</div>,
      },
      {
        title: t('onboarding.signaler.page3.title'),
        content: (
          <ul className="list-disc">
            <li>{t('onboarding.signaler.page3.item1')}</li>
            <li>{t('onboarding.signaler.page3.item2')}</li>
            <li>{t('onboarding.signaler.page3.item3')}</li>
          </ul>
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
          where: 'builder',
          step: segmentKey,
        })
      }
    />
  );
}
