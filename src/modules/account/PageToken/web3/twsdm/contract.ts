import { useAccount, useBalance } from 'wagmi';
import { TWSDM_CONTRACT_ADDRESS } from 'modules/account/PageToken/constants';

export function useTwsdmBalance() {
  const { address } = useAccount();
  return useBalance({
    address,
    token: TWSDM_CONTRACT_ADDRESS,
    enabled: !!address,
  });
}
