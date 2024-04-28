import { bxRightArrowAlt } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { notification } from 'antd';
import Button from 'shared/Button';
import { type FinancialProductInstance } from 'api/types/investorAssetStructure';
import Icon from 'shared/Icon';
import { useUpdateFPIStatusMutation } from 'api';
import { trackClick } from 'config/segment';
import { unwrapErrorMessage } from 'utils/error';
import CongratsPng from './congrats.png';

const StepDone: React.FC<{
  financialProductInstance: FinancialProductInstance;
}> = ({ financialProductInstance: fpi }) => {
  const updateFPIStatus = useUpdateFPIStatusMutation();
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const onStart = async () => {
    try {
      setStarting(true);
      trackClick('start_fp')();
      await updateFPIStatus.mutateAsync({
        status: 'start',
        fpiKey: fpi.key,
      });
      trackClick('started_fp')();
      navigate('/investment/assets/' + fpi.key);
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="-mt-9 text-center">
      <div className="-mb-6 flex justify-center text-5xl">
        <img className="h-[200px] w-[200px]" src={CongratsPng} />
      </div>
      <h1 className="mb-2 text-lg leading-4">Congratulations!</h1>
      <p className="mb-6 pb-6 text-white/50">
        Your financial product has been created.{' '}
      </p>

      <Button
        variant="primary"
        className="w-[360px] mobile:w-full"
        loading={starting}
        onClick={onStart}
      >
        Start Your Financial Product
        <Icon className="ml-2" name={bxRightArrowAlt} />
      </Button>
    </div>
  );
};

export default StepDone;
