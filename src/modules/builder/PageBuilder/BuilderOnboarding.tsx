/* eslint-disable react/no-unescaped-entities */
/* eslint-disable i18next/no-literal-string */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { track } from 'config/segment';
import { Onboarding } from 'shared/Onboarding';

export default function BuilderOnboarding() {
  const { t } = useTranslation('builder');

  const sections = useMemo(
    () => [
      {
        title: t('onboarding.builder.page1.title'),
        content: <div>{t('onboarding.builder.page1.description')}</div>,
      },
      {
        title: t('onboarding.builder.page2.title'),
        content: <div>{t('onboarding.builder.page2.description')}</div>,
      },
      {
        title: t('onboarding.builder.page3.title'),
        content: <div>{t('onboarding.builder.page3.description')}</div>,
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
