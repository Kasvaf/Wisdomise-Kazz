import { useParams } from 'react-router-dom';
import { useFpiQuery } from 'api/fpi';
import PageWrapper from 'modules/base/PageWrapper';
import FinancialProductItem from '../PageAssetOverview/ActiveFinancialProducts/FinancialProductItem';
import FPIPositionHistory from './FPIPositionHistory';
import FPITimeline from './FPITimeline';

const PageFPIPositions = () => {
  const params = useParams<{ fpiKey: string }>();
  const fpi = useFpiQuery(params.fpiKey);
  return (
    <PageWrapper loading={fpi.isLoading}>
      {fpi.data && (
        <div>
          <h1 className="mb-4 text-lg font-semibold text-white">
            Financial Product Details
          </h1>
          <FinancialProductItem fpi={fpi.data} className="mb-10" noDetailsBtn />
        </div>
      )}

      <FPITimeline fpiKey={params.fpiKey} className="mb-10" />

      <FPIPositionHistory fpiKey={params.fpiKey} />
    </PageWrapper>
  );
};

export default PageFPIPositions;
