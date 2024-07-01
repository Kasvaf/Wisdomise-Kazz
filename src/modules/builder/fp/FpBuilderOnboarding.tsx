/* eslint-disable react/no-unescaped-entities */
/* eslint-disable i18next/no-literal-string */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { track } from 'config/segment';
import { Onboarding } from 'shared/Onboarding';

export function FpBuilderOnboarding() {
  const { t } = useTranslation('builder');

  const sections = useMemo(
    () => [
      {
        title: t('onboarding.fp.page1.title'),
        content: <div>{t('onboarding.fp.page1.description')}</div>,
      },
      {
        title: t('onboarding.fp.page2.title'),
        content: (
          <div>
            {t('onboarding.fp.page2.description')}
            <ul className="ml-4 mt-2 list-disc">
              <li>{t('onboarding.fp.page2.item1')}</li>
              <li>{t('onboarding.fp.page2.item2')}</li>
            </ul>
          </div>
        ),
      },
      {
        title: t('onboarding.fp.page3.title'),
        content: (
          <div>
            {t('onboarding.fp.page3.description')}
            <div className="mt-4">
              {t('onboarding.fp.page3.item1.title')}
              <ul className="ml-4 mt-1 list-disc">
                <li>{t('onboarding.fp.page3.item1.item1')}</li>
                <li>{t('onboarding.fp.page3.item1.item2')}</li>
                <li>{t('onboarding.fp.page3.item1.item3')}</li>
                <li>{t('onboarding.fp.page3.item1.item4')}</li>
              </ul>
              <div className="mt-1 font-semibold">
                **{t('onboarding.fp.page3.item1.notice')}**
              </div>
            </div>
            <div className="mt-2">{t('onboarding.fp.page3.item2.title')}</div>
          </div>
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
