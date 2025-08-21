import { TWSDM_CONTRACT_ADDRESS } from 'modules/account/PageToken/constants';
import { useAccount, useBalance } from 'wagmi';

export function useTWSDMBalance() {
  const { address } = useAccount();
  return useBalance({
    address,
    token: TWSDM_CONTRACT_ADDRESS,
    query: {
      enabled: !!address,
    },
  });
}
