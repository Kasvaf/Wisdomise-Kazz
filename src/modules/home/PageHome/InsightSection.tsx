import { useTranslation } from 'react-i18next';
import { useHasFlag } from 'api';
import { ReactComponent as InsightIcon } from './icon/insight.svg';
import Card from './Card';
import { ReactComponent as SignalMatrixIcon } from './icon/signalMatrix.svg';
import { ReactComponent as SocialRadarIcon } from './icon/socialRadar.svg';
import { ReactComponent as ChatBotIcon } from './icon/chatbot.svg';

import Title from './title';

export default function InsightSection() {
  const hasFlag = useHasFlag();
  const { t } = useTranslation('home');

  return (
    <section className="mt-12">
      <Title
        icon={InsightIcon}
        title={t('insight.title')}
        subTitle={t('insight.subtitle')}
      />

      <section className="mt-8 grid grid-cols-3 gap-4 mobile:grid-cols-1">
        <Card
          to="/insight/signals"
          videoId="12CWx7r2WY8"
          title={t('insight.signal-matrix.title')}
          icon={SignalMatrixIcon}
          tag={t('insight.signal-matrix.tag')}
          ctaSegmentEvent="onboarding_signal_matrix"
          description={t('insight.signal-matrix.description')}
        />
        {hasFlag('/insight/social-radar') && (
          <Card
            title={t('insight.social-radar.title')}
            icon={SocialRadarIcon}
            to="/insight/social-radar"
            ctaSegmentEvent="onboarding_social_radar"
            info={t('insight.social-radar.info')}
            description={t('insight.social-radar.description')}
          />
        )}

        <Card
          icon={ChatBotIcon}
          to="/insight/athena"
          title={t('insight.chatbot.title')}
          ctaTitle={t('insight.chatbot.cta-title')}
          ctaSegmentEvent="onboarding_chatbot"
          info={t('insight.chatbot.info')}
          description={t('insight.chatbot.description')}
        />
      </section>
    </section>
  );
}
