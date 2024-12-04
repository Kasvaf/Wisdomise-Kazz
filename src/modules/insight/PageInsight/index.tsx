import { Trans, useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import { formatNumber } from 'utils/numbers';
import { useMarketInfoFromSignals } from 'api';
import { RsiConfirmationWidget } from './components/RsiConfirmationWidget';
import { HotCoinsWidget } from './components/HotCoinsWidget';
import { AlertBoxWidget } from './components/AlertBoxWidget';
import { TopWhaleCoinsWidget } from './components/TopWhaleCoinsWidget';
import { TopWhaleListWidget } from './components/TopWhaleListWidget';
import { PageInsightMeta } from './components/PageInsightMeta';
import { InsightOnboarding } from './components/InsightOnboarding';

const PageInsight = () => {
  const { t } = useTranslation();
  const marketInfo = useMarketInfoFromSignals();

  return (
    <PageWrapper>
      <PageInsightMeta />
      <PageTitle
        title={t('base:menu.coin-radar.full-title')}
        description={
          <Trans
            ns="coin-radar"
            i18nKey="coin-radar:social-radar.table.description"
            values={{
              posts: formatNumber(marketInfo.data?.analyzed_messages ?? 4000, {
                compactInteger: true,
                decimalLength: 0,
                seperateByComma: true,
                minifyDecimalRepeats: false,
              }),
            }}
          />
        }
        className="mb-10"
      />

      <div className="grid grid-cols-6 gap-6">
        <HotCoinsWidget className="col-span-4 mobile:col-span-full" />
        <AlertBoxWidget className="col-span-2 mobile:order-first mobile:col-span-full" />
        <TopWhaleCoinsWidget className="col-span-2 h-[530px]  mobile:col-span-full" />
        <TopWhaleListWidget className="col-span-4 h-[530px] mobile:col-span-full" />
        <RsiConfirmationWidget
          className="col-span-3 mobile:col-span-full"
          type="bullish"
        />
        <RsiConfirmationWidget
          className="col-span-3 mobile:col-span-full"
          type="bearish"
        />
      </div>
      <InsightOnboarding />
    </PageWrapper>
  );
};

export default PageInsight;
