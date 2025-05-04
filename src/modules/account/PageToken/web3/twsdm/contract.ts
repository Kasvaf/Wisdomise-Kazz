import { useAccount, useBalance } from 'wagmi';
import { TWSDM_CONTRACT_ADDRESS } from 'modules/account/PageToken/constants';

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
