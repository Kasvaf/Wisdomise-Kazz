import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import YouTube from 'react-youtube';
import { track } from 'config/segment';
import { Onboarding } from 'shared/Onboarding';

export function WsdmOnboarding() {
  const { t } = useTranslation('wisdomise-token');
  const sections = useMemo(
    () => [
      {
        title: t('onboarding.sec-1.title'),
        content: (
          <>
            <Trans i18nKey="onboarding.sec-1.content" ns="wisdomise-token">
              This video is your one-stop guide for migrating your WSDM tokens
              on the Wisdomise platform.
            </Trans>
            <YouTube
              opts={{ height: '260', width: '100%' }}
              videoId="jdMFq0vU7-U"
            />
          </>
        ),
      },
      {
        title: t('onboarding.sec-2.title'),
        content: (
          <>
            <Trans i18nKey="onboarding.sec-2.content" ns="wisdomise-token">
              This video is your one-stop guide for migrating your WSDM tokens
              on the Wisdomise platform.
            </Trans>
            <YouTube
              opts={{ height: '260', width: '100%' }}
              videoId="s-Z27Phzqu8"
            />
          </>
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
          where: 'wsdm',
          step: segmentKey,
        })
      }
    />
  );
}
