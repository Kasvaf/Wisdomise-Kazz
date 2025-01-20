import { Trans, useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import { useCoinRadarCoins } from 'api';
import { PageInsightMeta } from './components/PageInsightMeta';
import { InsightOnboarding } from './components/InsightOnboarding';
import { InsightAlertButton } from './components/InsightAlertButton';
import { ReactComponent as Logo } from './components/logo.svg';
import { CoinRadarTable } from './components/CoinRadarTable';

const PageInsight = () => {
  const { t } = useTranslation();
  const coins = useCoinRadarCoins();

  return (
    <PageWrapper loading={coins.isLoading}>
      <PageInsightMeta />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-6">
          <PageTitle
            className="max-w-4xl mobile:max-w-full"
            title={
              <>
                <Logo />
                {t('base:menu.coin-radar.full-title')}
              </>
            }
            description={
              <Trans ns="coin-radar" i18nKey="base:menu.coin-radar.subtitle" />
            }
          />
          <InsightAlertButton />
        </div>
        <CoinRadarTable />
      </div>
      <InsightOnboarding />
    </PageWrapper>
  );
};

export default PageInsight;
