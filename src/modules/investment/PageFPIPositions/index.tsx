import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFpiQuery } from 'api/fpi';
import PageWrapper from 'modules/base/PageWrapper';
import FinancialProductItem from '../PageAssetOverview/ActiveFinancialProducts/FinancialProductItem';
import FPIPositionHistory from './FPIPositionHistory';
import FPITimeline from './FPITimeline';

const PageFPIPositions = () => {
  const { t } = useTranslation('products');
  const params = useParams<{ fpiKey: string }>();
  const fpi = useFpiQuery(params.fpiKey);
  return (
    <PageWrapper loading={fpi.isLoading}>
      {fpi.data && (
        <div>
          <h1 className="mb-4 text-lg font-semibold text-white">
            {t('fpi-page.title')}
          </h1>
          <FinancialProductItem fpi={fpi.data} className="mb-10" noDetailsBtn />
        </div>
      )}

      {fpi.data?.status !== 'DRAFT' && (
        <>
          <FPITimeline fpiKey={params.fpiKey} className="mb-10" />
          <FPIPositionHistory fpiKey={params.fpiKey} />
        </>
      )}
    </PageWrapper>
  );
};

export default PageFPIPositions;
