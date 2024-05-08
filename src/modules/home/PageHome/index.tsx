import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import {
  useFinancialProductsQuery,
  useHasFlag,
  useInvestorAssetStructuresQuery,
} from 'api';
import { useUserSignalQuery } from 'api/notification';
import { ReactComponent as InsightIcon } from './icon/insight.svg';
import { ReactComponent as InvestmentIcon } from './icon/investment.svg';
import Card from './Card';
import { ReactComponent as SignalMatrixIcon } from './icon/signalMatrix.svg';
import { ReactComponent as SocialRadarIcon } from './icon/socialRadar.svg';
import { ReactComponent as ChatBotIcon } from './icon/chatbot.svg';
import { ReactComponent as FinancialProductsIcon } from './icon/financialProducts.svg';
import Title from './title';
import GuideSection from './Guide';

export default function HomePage() {
  const hasFlag = useHasFlag();
  const { t } = useTranslation('home');
  const userSignals = useUserSignalQuery();
  const ias = useInvestorAssetStructuresQuery();
  const financialProducts = useFinancialProductsQuery({ page: 1 });

  return (
    <PageWrapper
      loading={
        financialProducts.isLoading || ias.isLoading || userSignals.isLoading
      }
    >
      <GuideSection />
      <section>
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

      <section className="mt-12">
        <Title
          icon={InvestmentIcon}
          title={t('auto-trade.title')}
          subTitle={t('auto-trade.subtitle')}
        />

        <section className="mt-8 grid grid-cols-2 gap-4 mobile:grid-cols-1">
          <Card
            title={t('auto-trade.fps.title')}
            icon={FinancialProductsIcon}
            to="/investment/products-catalog"
            ctaSegmentEvent="onboarding_FP"
            ctaTitle={t('auto-trade.fps.cta-title')}
            tag={`${financialProducts.data?.count || ''} ${t(
              'auto-trade.fps.tag',
            )}`}
            hint={t('auto-trade.fps.hint')}
            description={t('auto-trade.fps.description')}
            info={t('auto-trade.fps.info')}
          />
          {hasFlag('/builder') && (
            <Card
              to="/builder/signalers"
              title={t('auto-trade.builder.title')}
              icon={SocialRadarIcon}
              ctaTitle={t('auto-trade.builder.cat-title')}
              ctaSegmentEvent="onboarding_strategy_builder"
              description={t('auto-trade.builder.description')}
              info={t('auto-trade.builder.info')}
            />
          )}
        </section>
      </section>
    </PageWrapper>
  );
}
