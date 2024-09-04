import { notification } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { zeroAddress } from 'viem';
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  useBalance,
  useWaitForTransaction,
} from 'wagmi';

export function useAllowance(address: `0x${string}`, spender: `0x${string}`) {
  const { address: owner } = useAccount();
  return useContractRead({
    abi: erc20ABI,
    address,
    functionName: 'allowance',
    args: [owner ?? zeroAddress, spender],
    enabled: !!address,
  });
}

export function useApprove(address: `0x${string}`) {
  return useContractWrite({
    abi: erc20ABI,
    address,
    functionName: 'approve',
  });
}

export function useIncreaseAllowance(
  address: `0x${string}`,
  spender: `0x${string}`,
) {
  const { address: owner } = useAccount();
  const { data: balance } = useBalance({
    address: owner,
    token: address,
  });
  const [a, setA] = useState(0n);
  const { data: allowance, refetch: refetchAllowance } = useAllowance(
    address,
    spender,
  );
  const {
    write: approve,
    isLoading: approveIsLoading,
    data: approveResult,
  } = useApprove(address);
  const [isAllowed, setIsAllowed] = useState<{ emit: true }>();

  const { data: approveTrxReceipt, isLoading: approveTrxIsLoading } =
    useWaitForTransaction({ hash: approveResult?.hash });

  const checkAllowance = (amount: bigint = balance?.value ?? 0n) => {
    setA(amount);
    if (allowance && allowanceIsHigherThanBalance(allowance, amount)) {
      setIsAllowed({ emit: true });
    } else {
      approve({
        args: [spender, amount],
      });
    }
  };

  const allowanceIsHigherThanBalance = useCallback(
    (allow: bigint, amount: bigint) => {
      return (allow ?? 0n) >= amount;
    },
    [],
  );

  useEffect(() => {
    if (approveTrxReceipt?.status === 'success') {
      void refetchAllowance().then(({ data }) => {
        if (data && allowanceIsHigherThanBalance(data, a)) {
          setIsAllowed({ emit: true });
        } else {
          notification.error({
            message: 'Allowance cap is less than your balance.',
          });
        }
        return null;
      });
    } else if (approveTrxReceipt?.status === 'reverted') {
      notification.error({
        message: 'Approve transaction reverted.',
      });
    }
  }, [approveTrxReceipt, allowanceIsHigherThanBalance, refetchAllowance, a]);

  return {
    checkAllowance,
    isAllowed,
    isLoading: approveIsLoading || approveTrxIsLoading,
  };
}
