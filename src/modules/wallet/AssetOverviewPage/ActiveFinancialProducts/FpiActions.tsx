import { type AxiosError } from 'axios';
import { notification } from 'antd';
import { useUpdateFPIStatusMutation } from 'api';
import { type FinancialProductInstance } from 'api/types/investorAssetStructure';
import { ReactComponent as DeactivateIcon } from '../icons/deactivate.svg';
import { ReactComponent as StartIcon } from '../icons/start.svg';
import { ReactComponent as PauseIcon } from '../icons/pause.svg';
import { PopConfirmChangeFPIStatus } from './PopConfirmChangeFPIStatus';

const FpiActions = ({ fpi }: { fpi: FinancialProductInstance }) => {
  const updateFPIStatus = useUpdateFPIStatusMutation();
  const changeFpiStatus = async (
    fpiKey: string,
    status: 'stop' | 'start' | 'pause' | 'resume',
  ) => {
    try {
      await updateFPIStatus.mutateAsync({
        status,
        fpiKey,
      });
    } catch (error) {
      notification.error({
        message:
          (error as AxiosError<{ message: string }>).response?.data.message ||
          '',
      });
    }
  };

  return (
    <div className="flex items-center justify-center gap-x-2">
      <PopConfirmChangeFPIStatus
        type="stop"
        onConfirm={() => changeFpiStatus(fpi.key, 'stop')}
      >
        <DeactivateIcon className="cursor-pointer text-white/80" />
      </PopConfirmChangeFPIStatus>

      <PopConfirmChangeFPIStatus
        type={
          fpi.status === 'DRAFT'
            ? 'start'
            : fpi.status === 'RUNNING'
            ? 'pause'
            : 'resume'
        }
        onConfirm={() =>
          changeFpiStatus(
            fpi.key,
            fpi.status === 'DRAFT'
              ? 'start'
              : fpi.status === 'RUNNING'
              ? 'pause'
              : 'resume',
          )
        }
      >
        {fpi.status === 'RUNNING' ? (
          <PauseIcon className="cursor-pointer text-white/80" />
        ) : (
          <StartIcon className="cursor-pointer text-white/80" />
        )}
      </PopConfirmChangeFPIStatus>
    </div>
  );
};

export default FpiActions;
