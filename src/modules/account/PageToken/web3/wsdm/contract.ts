import {
  useAccount,
  useBalance,
  useChainId,
  useContractRead,
  useSignTypedData,
} from 'wagmi';
import { zeroAddress } from 'viem';
import { WSDM_ABI } from 'modules/account/PageToken/web3/wsdm/abi';
import {
  LOCKING_CONTRACT_ADDRESS,
  WSDM_CONTRACT_ADDRESS,
} from 'modules/account/PageToken/constants';

const wsdmContractDefaultConfig = {
  address: WSDM_CONTRACT_ADDRESS,
  abi: WSDM_ABI,
} as const;

export function useWsdmBalance() {
  const { address } = useAccount();
  return useBalance({ address, token: WSDM_CONTRACT_ADDRESS });
}

export function useReadWsdmNonces() {
  const { address } = useAccount();
  return useContractRead({
    ...wsdmContractDefaultConfig,
    functionName: 'nonces',
    args: [address ?? zeroAddress],
    enabled: !!address,
  });
}

export function useReadWsdmName() {
  return useContractRead({
    ...wsdmContractDefaultConfig,
    functionName: 'name',
  });
}

export function useWsdmSignTypedDataForLocking() {
  const chainId = useChainId();
  const { refetch: fetchNonce } = useReadWsdmNonces();
  const { address } = useAccount();
  const { data: name } = useReadWsdmName();
  const { signTypedDataAsync, isLoading } = useSignTypedData();

  const sign = async (value: number, deadline: number) => {
    const domain = {
      name,
      version: '1',
      chainId,
      verifyingContract: WSDM_CONTRACT_ADDRESS as `0x${string}`,
    };

    const types = {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    };

    const values = {
      owner: address,
      spender: LOCKING_CONTRACT_ADDRESS,
      value,
      nonce: (await fetchNonce()).data,
      deadline,
    };

    return await signTypedDataAsync({
      domain,
      types,
      message: values,
      primaryType: 'Permit',
    });
  };

  return { sign, isLoading };
}
