import { useReadLockedBalance } from 'modules/account/PageToken/web3/locking/contract';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useAccountQuery, usePlansQuery } from 'services/rest';
import { useLockingRequirementQuery } from 'services/rest/defi';
import { useAccount } from 'wagmi';

export const useVipAccessFlow = () => {
  const isLoggedIn = useIsLoggedIn();
  const { isConnected, address } = useAccount();
  const { data: account } = useAccountQuery();
  const { data: lockedBalance } = useReadLockedBalance();

  const plans = usePlansQuery();
  const plan = plans.data?.results[0];

  const { data: generalLockingRequirement } = useLockingRequirementQuery(
    plan?.price,
  );

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
