import { notification } from 'antd';
import { useEffect, useRef } from 'react';
import { erc20Abi, zeroAddress } from 'viem';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';

export function useReadAllowance(
  contract: `0x${string}`,
  spender: `0x${string}`,
) {
  const { address } = useAccount();

  return useReadContract({
    abi: erc20Abi,
    address: contract,
    functionName: 'allowance',
    args: [address ?? zeroAddress, spender],
    query: {
      enabled: !!contract && !!address,
    },
  });
}

export function useWriteApprove(
  contract: `0x${string}`,
  spender: `0x${string}`,
) {
  const mutation = useWriteContract();
  const { resolver, isWaiting } = useWaitResolver(mutation.data);

  const writeAndWait = (amount: bigint) => {
    mutation.writeContract({
      abi: erc20Abi,
      address: contract,
      functionName: 'approve',
      args: [spender, amount],
    });

    return resolver();
  };

  return {
    ...mutation,
    writeAndWait,
    isWaiting,
  };
}

export function useEnsureAllowance(
  token: `0x${string}`,
  spender: `0x${string}`,
) {
  const { data: allowance, refetch } = useReadAllowance(token, spender);
  const {
    writeAndWait: approve,
    isPending,
    isWaiting,
  } = useWriteApprove(token, spender);

  const ensureAllowance = async (amount: bigint) => {
    return allowance && allowance >= amount
      ? true
      : await approve(amount).then(async () => {
          const { data: newAllowance } = await refetch();
          if (newAllowance && newAllowance >= amount) {
            return true;
          } else {
            notification.error({
              message: 'Allowance cap is less than your balance.',
            });
            return false;
          }
        });
  };

  return {
    ensureAllowance,
    isPending,
    isWaiting,
  };
}

export function useWaitResolver(hash?: `0x${string}`) {
  const resolverRef = useRef<VoidFunction | null>(null);
  const { isLoading: isWaiting, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (receipt?.status === 'success') {
      resolverRef.current?.();
      resolverRef.current = null;
    }
  }, [receipt]);

  return {
    resolver: () =>
      new Promise<void>(resolve => {
        resolverRef.current = resolve;
      }),
    isWaiting,
  };
}
