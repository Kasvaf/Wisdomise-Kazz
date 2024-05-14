import { useTranslation } from 'react-i18next';
import { useFinancialProductsQuery, useHasFlag } from 'api';
import { ReactComponent as InvestmentIcon } from './icon/investment.svg';
import Card from './Card';
import { ReactComponent as SocialRadarIcon } from './icon/socialRadar.svg';
import { ReactComponent as FinancialProductsIcon } from './icon/financialProducts.svg';

import Title from './title';

export default function PassiveIncomeSection() {
  const hasFlag = useHasFlag();
  const { t } = useTranslation('home');
  const financialProducts = useFinancialProductsQuery({ page: 1 });

  return (
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
  );
}
