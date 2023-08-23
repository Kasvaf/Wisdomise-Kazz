import { type AxiosError } from 'axios';
import { notification } from 'antd';
import { useCallback } from 'react';
import { type FpiStatusMutationType, useUpdateFPIStatusMutation } from 'api';
import { type FinancialProductInstance } from 'api/types/investorAssetStructure';
import { ReactComponent as DeactivateIcon } from '../icons/deactivate.svg';
import { ReactComponent as StartIcon } from '../icons/start.svg';
import { ReactComponent as PauseIcon } from '../icons/pause.svg';
import PopConfirmChangeFPIStatus from './PopConfirmChangeFPIStatus';

const NextActionByStatus: Record<
  FinancialProductInstance['status'],
  FpiStatusMutationType
> = {
  DRAFT: 'start',
  RUNNING: 'pause',
  PAUSED: 'resume',
};

const FpiActions = ({ fpi }: { fpi: FinancialProductInstance }) => {
  const updateFPIStatus = useUpdateFPIStatusMutation();
  const changeFpiStatus = useCallback(
    async (fpiKey: string, status: FpiStatusMutationType) => {
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
    },
    [updateFPIStatus],
  );

  return (
    <div className="flex items-center justify-center gap-x-2">
      <PopConfirmChangeFPIStatus
        type="stop"
        onConfirm={useCallback(
          () => changeFpiStatus(fpi.key, 'stop'),
          [changeFpiStatus, fpi.key],
        )}
      >
        <DeactivateIcon className="cursor-pointer text-white/80" />
      </PopConfirmChangeFPIStatus>

      <PopConfirmChangeFPIStatus
        type={NextActionByStatus[fpi.status]}
        onConfirm={useCallback(
          () => changeFpiStatus(fpi.key, NextActionByStatus[fpi.status]),
          [changeFpiStatus, fpi.key, fpi.status],
        )}
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
