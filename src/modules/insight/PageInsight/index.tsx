import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import { OverviewWidget } from 'shared/OverviewWidget';
import { useHasFlag } from 'api';
import { HotCoinsTable } from './HotCoinsTable';
import { TopWhaleListTable } from './TopWhaleListTable';
import { TopWhaleCoinsTable } from './TopWhaleCoinsTable';
import { RsiOvernessTable } from './RsiOvernessTable';
import { SeeMoreLink } from './SeeMoreLink';
import { AlertBox } from './AlertBox';

const PageInsight = () => {
  const { t } = useTranslation();
  const hasFlag = useHasFlag();

  return (
    <PageWrapper>
      <PageTitle
        title={t('base:menu.coin-radar.full-title')}
        description={t('base:menu.coin-radar.subtitle')}
        className="mb-10"
      />

      <div className="grid grid-cols-6 gap-6">
        {hasFlag('/insight/coin-radar') && (
          <OverviewWidget
            className="col-span-4 mobile:col-span-full"
            title={t('coin-radar:hot-coins-section.title')}
            headerActions={<SeeMoreLink to="/insight/coin-radar" />}
          >
            <HotCoinsTable />
          </OverviewWidget>
        )}
        {hasFlag('/insight/coin-radar') && (
          <OverviewWidget
            className="col-span-2 bg-gradient-to-t from-v1-background-brand via-v1-background-brand/30 to-v1-surface-l3 mobile:order-first mobile:col-span-full mobile:h-72"
            contentClassName="h-full"
          >
            <AlertBox />
          </OverviewWidget>
        )}
        {hasFlag('/insight/whales') && (
          <OverviewWidget
            className="col-span-2 max-h-[470px] mobile:col-span-full"
            title={t('whale:sections.top-coins.title')}
            info={t('whale:sections.top-coins.subtitle')}
            headerActions={<SeeMoreLink to="/insight/whales" />}
          >
            <TopWhaleCoinsTable />
          </OverviewWidget>
        )}
        {hasFlag('/insight/whales') && (
          <OverviewWidget
            className="col-span-4 mobile:col-span-full"
            title={t('whale:sections.top-whales.title')}
            info={t('whale:sections.top-whales.subtitle')}
            headerActions={<SeeMoreLink to="/insight/whales" />}
          >
            <TopWhaleListTable />
          </OverviewWidget>
        )}
        {hasFlag('/insight/market-pulse') && (
          <OverviewWidget
            className="col-span-3 max-h-[470px] mobile:col-span-full "
            title={t('market-pulse:indicator_list.rsi.oversold-full-title')}
            info={t('market-pulse:indicator_list.rsi.oversold-info')}
            headerActions={<SeeMoreLink to="/insight/market-pulse" />}
          >
            <RsiOvernessTable type="over_sold" />
          </OverviewWidget>
        )}
        {hasFlag('/insight/market-pulse') && (
          <OverviewWidget
            className="col-span-3 max-h-[470px] mobile:col-span-full "
            title={t('market-pulse:indicator_list.rsi.overbought-full-title')}
            info={t('market-pulse:indicator_list.rsi.overbought-info')}
            headerActions={<SeeMoreLink to="/insight/market-pulse" />}
          >
            <RsiOvernessTable type="over_bought" />
          </OverviewWidget>
        )}
      </div>
    </PageWrapper>
  );
};

export default PageInsight;
