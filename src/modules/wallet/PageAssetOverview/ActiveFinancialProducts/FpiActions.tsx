import { type AxiosError } from 'axios';
import { notification } from 'antd';
import { clsx } from 'clsx';
import { useCallback } from 'react';
import { bxPause, bxPlay, bxStop } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import { type FpiStatusMutationType, useUpdateFPIStatusMutation } from 'api';
import { type FinancialProductInstance } from 'api/types/investorAssetStructure';
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
  className?: string;
}> = ({ fpi, className }) => {
  const navigate = useNavigate();
  const updateFPIStatus = useUpdateFPIStatusMutation();
  const changeFpiStatus = useCallback(
    async (fpiKey: string, status: FpiStatusMutationType) => {
      try {
        await updateFPIStatus.mutateAsync({
          status,
          fpiKey,
        });

        if (status === 'stop') {
          navigate('/app/assets');
        }
      } catch (error) {
        notification.error({
          message:
            (error as AxiosError<{ message: string }>).response?.data.message ||
            '',
        });
      }
    },
    [updateFPIStatus, navigate],
  );

  return (
    <div className={clsx('flex items-center justify-end gap-x-2', className)}>
      <PopConfirmChangeFPIStatus
        type="stop"
        onConfirm={useCallback(
          () => changeFpiStatus(fpi.key, 'stop'),
          [changeFpiStatus, fpi.key],
        )}
      >
        <FabButton icon={bxStop} />
      </PopConfirmChangeFPIStatus>

      <PopConfirmChangeFPIStatus
        disabled={fpi.status !== 'RUNNING'}
        type="pause"
        onConfirm={useCallback(
          () => changeFpiStatus(fpi.key, NextActionByStatus[fpi.status]),
          [changeFpiStatus, fpi.key, fpi.status],
        )}
      >
        <FabButton disabled={fpi.status !== 'RUNNING'} icon={bxPause} />
      </PopConfirmChangeFPIStatus>

      <PopConfirmChangeFPIStatus
        disabled={fpi.status === 'RUNNING'}
        type={NextActionByStatus[fpi.status]}
        onConfirm={useCallback(
          () => changeFpiStatus(fpi.key, NextActionByStatus[fpi.status]),
          [changeFpiStatus, fpi.key, fpi.status],
        )}
      >
        <FabButton disabled={fpi.status === 'RUNNING'} icon={bxPlay} />
      </PopConfirmChangeFPIStatus>
    </div>
  );
};

export default FpiActions;
