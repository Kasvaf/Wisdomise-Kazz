import {
  useAccount,
  useBalance,
  useChainId,
  useContractRead,
  useContractWrite,
  useSignTypedData,
} from 'wagmi';
import { zeroAddress } from 'viem';
import { isProduction } from 'utils/version';
import { WSDM_ABI } from 'modules/account/PageToken/web3/wsdm/abi';
import { LOCKING_CONTRACT_ADDRESS } from 'modules/account/PageToken/web3/locking/contract';

export const WSDM_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0xF19a1bFe94Bfe98F7568A7cB5002B8B8080f71fe';

const wsdmContractDefaultConfig = {
  address: WSDM_CONTRACT_ADDRESS,
  abi: WSDM_ABI,
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

export function useWriteWsdmPermit() {
  return useContractWrite({
    ...wsdmContractDefaultConfig,
    functionName: 'permit',
  });
}

export function useWSDMPermitSignature() {
  const { refetch } = useReadWsdmNonces();
  const { data: name } = useReadWsdmName();
  const { signTypedData, data: signature } = useSignTypedData();
  const chainId = useChainId();
  const { address } = useAccount();

  const sign = async (value: number) => {
    const deadline = Math.floor(Date.now() / 1000) + 30 * 60;
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
      nonce: (await refetch()).data,
      deadline,
    };

    signTypedData({
      domain,
      types,
      message: values,
      primaryType: 'Permit',
    });

    return deadline;
  };

  return { sign, signature };
}
