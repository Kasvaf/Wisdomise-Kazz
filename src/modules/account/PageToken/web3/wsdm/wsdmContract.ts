import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
} from 'wagmi';
import { zeroAddress } from 'viem';
import { isProduction } from 'utils/version';

export const WSDM_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0xF19a1bFe94Bfe98F7568A7cB5002B8B8080f71fe';

const wsdmContractDefaultConfig = {
  address: WSDM_CONTRACT_ADDRESS,
  abi: erc20ABI,
} as const;

export function useWsdmBalance() {
  const { address } = useAccount();
  return useBalance({ address, token: WSDM_CONTRACT_ADDRESS });
}

export function useReadWsdmAllowance(contractAddress: `0x${string}`) {
  const { address } = useAccount();
  return useContractRead({
    ...wsdmContractDefaultConfig,
    functionName: 'allowance',
    args: [address ?? zeroAddress, contractAddress],
    enabled: !!address,
  });
}

// export function useReadWsdmNonce() {
//   const { address } = useAccount();
//   return useContractRead({
//     ...wsdmContractDefaultConfig,
//     functionName: 'nonce',
//   });
// }

export function useWriteWsdmApprove() {
  return useContractWrite({
    ...wsdmContractDefaultConfig,
    functionName: 'approve',
  });
}
