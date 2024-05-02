import { type AxiosError } from 'axios';
import { notification } from 'antd';
import { clsx } from 'clsx';
import { bxPause, bxPlay, bxStop } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import { type FpiStatusMutationType, useUpdateFPIStatusMutation } from 'api';
import { type FinancialProductInstance } from 'api/types/investorAssetStructure';
import { trackClick } from 'config/segment';
import FabButton from 'shared/FabButton';
import PopConfirmChangeFPIStatus from './PopConfirmChangeFPIStatus';

const NextActionByStatus: Record<
  FinancialProductInstance['status'],
  FpiStatusMutationType
> = {
  DRAFT: 'start',
  RUNNING: 'pause',
  PAUSED: 'resume',
};

const FpiActions: React.FC<{
  fpi: FinancialProductInstance;
  iconSize?: number;
  className?: string;
}> = ({ fpi, iconSize, className }) => {
  const navigate = useNavigate();
  const updateFPIStatus = useUpdateFPIStatusMutation();
  const changeFpiStatus = async (
    fpiKey: string,
    status: FpiStatusMutationType,
  ) => {
    try {
      trackClick(status.toLowerCase() + '_fp')();
      await updateFPIStatus.mutateAsync({
        status,
        fpiKey,
      });
      trackClick(status.toLowerCase() + 'ed_fp')();

      if (status === 'stop') {
        navigate('/investment/assets');
      }
    } catch (error) {
      notification.error({
        message:
          (error as AxiosError<{ message: string }>).response?.data.message ||
          '',
      });
    }
  };

  return (
    <div className={clsx('flex items-center justify-end gap-x-2', className)}>
      <PopConfirmChangeFPIStatus
        type="stop"
        onConfirm={() => changeFpiStatus(fpi.key, 'stop')}
      >
        <FabButton size={iconSize} icon={bxStop} />
      </PopConfirmChangeFPIStatus>

      <PopConfirmChangeFPIStatus
        disabled={fpi.status !== 'RUNNING'}
        type="pause"
        onConfirm={() =>
          changeFpiStatus(fpi.key, NextActionByStatus[fpi.status])
        }
      >
        <FabButton
          size={iconSize}
          disabled={fpi.status !== 'RUNNING'}
          icon={bxPause}
        />
      </PopConfirmChangeFPIStatus>

      <PopConfirmChangeFPIStatus
        disabled={fpi.status === 'RUNNING'}
        type={NextActionByStatus[fpi.status]}
        onConfirm={() =>
          changeFpiStatus(fpi.key, NextActionByStatus[fpi.status])
        }
      >
        <FabButton
          size={iconSize}
          disabled={fpi.status === 'RUNNING'}
          icon={bxPlay}
        />
      </PopConfirmChangeFPIStatus>
    </div>
  );
};

export default FpiActions;
