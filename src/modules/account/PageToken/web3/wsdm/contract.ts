import { useAccount, useBalance } from 'wagmi';
import { WSDM_CONTRACT_ADDRESS } from 'modules/account/PageToken/constants';

export function useWSDMBalance() {
  const { address } = useAccount();
  return useBalance({
    address,
    token: WSDM_CONTRACT_ADDRESS,
    query: { enabled: !!address },
  });
}
