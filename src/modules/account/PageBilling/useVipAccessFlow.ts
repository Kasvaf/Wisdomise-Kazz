import { useAccount } from 'wagmi';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useAccountQuery } from 'api';
import { useReadLockedBalance } from 'modules/account/PageToken/web3/locking/contract';
import { useLockingRequirementQuery } from 'api/defi';

export const useVipAccessFlow = ({ planPrice }: { planPrice: number }) => {
  const isLoggedIn = useIsLoggedIn();
  const { isConnected, address } = useAccount();
  const { data: account } = useAccountQuery();
  const { data: lockedBalance } = useReadLockedBalance();
  const { data: generalLockingRequirement } =
    useLockingRequirementQuery(planPrice);

  const canSubscribe =
    generalLockingRequirement && lockedBalance
      ? (generalLockingRequirement?.requirement_locking_amount ?? 0) <=
        Number(lockedBalance) / 10 ** 6
      : false;

  const currentStep = isLoggedIn
    ? isConnected
      ? account?.wallet_address === address
        ? canSubscribe
          ? 4
          : 3
        : 2
      : 1
    : 0;

  return { currentStep };
};
