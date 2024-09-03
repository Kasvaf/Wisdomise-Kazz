import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import { HotCoinsWidget } from './components/HotCoinsWidget';
import { AlertBoxWidget } from './components/AlertBoxWidget';
import { TopWhaleCoinsWidget } from './components/TopWhaleCoinsWidget';
import { TopWhaleListWidget } from './components/TopWhaleListWidget';
import { RsiOvernessWidget } from './components/RsiOvernessWidget';

const PageInsight = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper>
      <PageTitle
        title={t('base:menu.coin-radar.full-title')}
        description={t('base:menu.coin-radar.subtitle')}
        className="mb-10"
      />

      <div className="grid grid-cols-6 gap-6">
        <HotCoinsWidget className="col-span-4 mobile:col-span-full" />
        <AlertBoxWidget className="col-span-2 mobile:order-first mobile:col-span-full" />
        <TopWhaleCoinsWidget className="col-span-2 max-h-[470px] mobile:col-span-full" />
        <TopWhaleListWidget className="col-span-4 mobile:col-span-full" />
        <RsiOvernessWidget
          className="col-span-3 max-h-[470px] mobile:col-span-full"
          type="over_sold"
        />
        <RsiOvernessWidget
          className="col-span-3 max-h-[470px] mobile:col-span-full"
          type="over_bought"
        />
      </div>
    </PageWrapper>
  );
};

export default PageInsight;
