import { notification } from 'antd';
import { useTWSDMBalance } from 'modules/account/PageToken/web3/twsdm/contract';
import { useWriteMigrate } from 'modules/account/PageToken/web3/migration/contract';
import { useVesting } from 'modules/account/PageToken/web3/tokenDistributer/useVesting';
import {
  TOKEN_MIGRATION_CONTRACT_ADDRESS,
  TWSDM_CONTRACT_ADDRESS,
} from 'modules/account/PageToken/constants';
import { useEnsureAllowance } from '../shared';

export function useMigration() {
  const { refetchAll } = useVesting();
  const { data, refetch: refetchTWSDMBalance } = useTWSDMBalance();
  const {
    ensureAllowance,
    isPending: approveIsPending,
    isWaiting: approveIsWaiting,
  } = useEnsureAllowance(
    TWSDM_CONTRACT_ADDRESS,
    TOKEN_MIGRATION_CONTRACT_ADDRESS,
  );

  const {
    writeAndWait,
    isPending: migrationIsPending,
    isWaiting: migrationIsWaiting,
  } = useWriteMigrate();

  const migrate = async () => {
    if (data?.value) {
      const isAllowed = await ensureAllowance(data.value);
      if (isAllowed) {
        await writeAndWait();
        notification.success({
          message: 'Migration process started successfully',
        });
        refetchAll();
        void refetchTWSDMBalance();
      }
    }
  };

  return {
    migrate,
    approveIsPending,
    approveIsWaiting,
    migrationIsPending,
    migrationIsWaiting,
  };
}
