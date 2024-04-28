import { useParams } from 'react-router-dom';
import { useMyFinancialProductUsageQuery } from 'api/builder';
import FancyPrice from 'shared/FancyPrice';
import Spinner from 'shared/Spinner';
import InfoBox from '../InfoBox';

const TabUsage = () => {
  const params = useParams<{ id: string }>();
  const { data: fp, isLoading } = useMyFinancialProductUsageQuery(params.id);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (!fp) return null;

  return (
    <section className="mt-8 flex justify-stretch gap-3 mobile:flex-col">
      <InfoBox title="Active Accounts">{fp.subscribers}</InfoBox>
      <InfoBox
        title={
          <>
            AUM <span className="text-xs">Asset Under Management</span>
          </>
        }
      >
        <FancyPrice value={fp.aum} />
      </InfoBox>
      <InfoBox
        title={
          <>
            Trading Volume <span className="text-xs text-[#34A3DA99]">7d</span>
          </>
        }
      >
        <FancyPrice value={fp.trading_volume} />
      </InfoBox>
    </section>
  );
};

export default TabUsage;
