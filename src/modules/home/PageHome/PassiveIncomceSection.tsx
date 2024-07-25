import { useTranslation } from 'react-i18next';
import { useFinancialProductsQuery, useHasFlag } from 'api';
import { PageTitle } from 'shared/PageTitle';
import { PageCard } from 'shared/PageCard';
import { trackClick } from 'config/segment';
import { ReactComponent as InvestmentIcon } from './icon/investment.svg';
import { ReactComponent as CoinRadarIcon } from './icon/coinRadar.svg';
import { ReactComponent as FinancialProductsIcon } from './icon/financialProducts.svg';

export default function PassiveIncomeSection() {
  const hasFlag = useHasFlag();
  const { t } = useTranslation('home');
  const financialProducts = useFinancialProductsQuery({ page: 1 });

  return (
    <section className="mt-12">
      <PageTitle
        icon={InvestmentIcon}
        title={t('auto-trade.title')}
        description={t('auto-trade.subtitle')}
      />

      <section className="mt-8 grid grid-cols-2 gap-4 mobile:grid-cols-1">
        <PageCard
          title={t('auto-trade.fps.title')}
          icon={FinancialProductsIcon}
          to="/investment/products-catalog"
          onClick={trackClick('onboarding_FP')}
          cta={t('auto-trade.fps.cta-title')}
          badge={`${financialProducts.data?.count || ''} ${t(
            'auto-trade.fps.tag',
          )}`}
          footer={t('auto-trade.fps.hint')}
          description={t('auto-trade.fps.description')}
          info={t('auto-trade.fps.info')}
        />
        {hasFlag('/builder') && (
          <PageCard
            to="/builder/signalers"
            title={t('auto-trade.builder.title')}
            icon={CoinRadarIcon}
            cta={t('auto-trade.builder.cat-title')}
            onClick={trackClick('onboarding_strategy_builder')}
            description={t('auto-trade.builder.description')}
            info={t('auto-trade.builder.info')}
          />
        )}
      </section>
    </section>
  );
}
