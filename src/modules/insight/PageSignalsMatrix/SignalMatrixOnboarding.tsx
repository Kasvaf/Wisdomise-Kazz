/* eslint-disable react/no-unescaped-entities */
/* eslint-disable i18next/no-literal-string */
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { track } from 'config/segment';
import { Onboarding } from 'shared/Onboarding';

export function SignalMatrixOnboarding() {
  const navigate = useNavigate();
  const { t } = useTranslation('strategy');

  const sections = useMemo(
    () => [
      {
        title: t('matrix.onboarding.sec-1.title'),
        content: (
          <Trans i18nKey="matrix.onboarding.sec-1.content" ns="strategy">
            Dive into our comprehensive signal center where you can watch all
            active and historical performance with a quick video overview. Get a
            glimpse of what's ahead!
          </Trans>
        ),
        video: '12CWx7r2WY8',
      },
      {
        title: t('matrix.onboarding.sec-2.title'),
        content: (
          <Trans i18nKey="matrix.onboarding.sec-2.content" ns="strategy">
            View active and closed signals for various coins on one screen.
            Analyze top-performers over the past 7 and 30 days, and tailor your
            strategy with ease.
          </Trans>
        ),
      },
      {
        title: t('matrix.onboarding.sec-3.title'),
        content: (
          <Trans i18nKey="matrix.onboarding.sec-3.content" ns="strategy">
            Set up Telegram alerts for the coins and signalers you follow. Stay
            informed with updates that matter to you, right when you need them.
            <br />
            <br />
            <button onClick={() => navigate('/account/notification-center')}>
              Set Notification
            </button>
          </Trans>
        ),
      },
      {
        title: t('matrix.onboarding.sec-4.title'),
        content: (
          <Trans i18nKey="matrix.onboarding.sec-4.content" ns="strategy">
            Explore our trio of signalers in one frame:
            <br />
            <br />
            <ol>
              <li>
                <h1>Vector:</h1> AI-powered trend analysis for aggressive gains
                with higher take-profit and stop-loss thresholds.
              </li>
              <li>
                <h1>Flash:</h1> Operates on the same AI trend logic as Vector
                but designed for lower risk with smaller targets.
              </li>
              <li>
                <h1>Range Master:</h1> A unique blend of human acumen and AI,
                offering a stable signaling strategy, exclusively optimized for
                Solana with adaptable timeframes.
              </li>
            </ol>
          </Trans>
        ),
      },
    ],
    [navigate, t],
  );
  return (
    <Onboarding
      sections={sections}
      onIntract={segmentKey =>
        track('Click On', {
          place: 'wizard',
          where: 'signal_matrix',
          step: segmentKey,
        })
      }
    />
  );
}
