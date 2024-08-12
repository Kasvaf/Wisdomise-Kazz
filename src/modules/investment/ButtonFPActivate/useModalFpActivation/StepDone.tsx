import { bxRightArrowAlt } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('products');
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
      navigate('/dashboard/portfolio');
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
      <h1 className="mb-2 text-lg leading-4">
        {t('fp-activation.congratulations')}
      </h1>
      <p className="mb-6 pb-6 text-white/50">
        {t('fp-activation.created-success')}
      </p>

      <Button
        variant="primary"
        className="w-[360px] mobile:w-full"
        loading={starting}
        onClick={onStart}
      >
        {t('fp-activation.btn-start')}
        <Icon className="ml-2" name={bxRightArrowAlt} />
      </Button>
    </div>
  );
};

export default StepDone;
