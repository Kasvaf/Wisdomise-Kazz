import { WSDM_CONTRACT_ADDRESS } from 'modules/account/PageToken/constants';
import { useAccount, useBalance } from 'wagmi';

export function useWSDMBalance() {
  const { address } = useAccount();
  return useBalance({
    address,
    token: WSDM_CONTRACT_ADDRESS,
    query: { enabled: !!address },
  });
}
