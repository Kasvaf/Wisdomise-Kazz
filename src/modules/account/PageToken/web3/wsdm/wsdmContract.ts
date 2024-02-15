import { useAccount, useBalance } from 'wagmi';
import { zeroAddress } from 'viem';
import { isProduction } from 'utils/version';

export const WSDM_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0xF19a1bFe94Bfe98F7568A7cB5002B8B8080f71fe';

export function useWsdmBalance() {
  const { address } = useAccount();
  return useBalance({ address, token: WSDM_CONTRACT_ADDRESS });
}
