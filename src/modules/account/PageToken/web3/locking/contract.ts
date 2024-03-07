import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { zeroAddress } from 'viem';
import { useEffect } from 'react';
import { notification } from 'antd';
import { LOCKING_ABI } from 'modules/account/PageToken/web3/locking/abi';
import { isProduction } from 'utils/version';

export const LOCKING_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x491b8293bffd71f9f649444f509301a8928d64b0';

const lockingContractDefaultConfig = {
  address: LOCKING_CONTRACT_ADDRESS,
  abi: LOCKING_ABI,
} as const;

export function useWriteLockWithPermit() {
  return useContractWrite({
    ...lockingContractDefaultConfig,
    functionName: 'lockWithPermit',
  });
}

export function useReadLockedBalance() {
  const { address } = useAccount();
  return useContractRead({
    ...lockingContractDefaultConfig,
    functionName: 'balanceOf',
    args: [address ?? zeroAddress],
    enabled: !!address,
  });
}

export function useReadUnlockedInfo() {
  const { address } = useAccount();
  return useContractRead({
    ...lockingContractDefaultConfig,
    functionName: 'getUserUnLockedInfo',
    args: [address ?? zeroAddress],
    enabled: !!address,
  });
}

export function useWriteUnlock() {
  return useContractWrite({
    ...lockingContractDefaultConfig,
    functionName: 'unlock',
  });
}

export function useWriteWithdraw() {
  return useContractWrite({
    ...lockingContractDefaultConfig,
    functionName: 'withdraw',
  });
}

export function useUnlock() {
  const { write, data: result, isLoading, error } = useWriteUnlock();
  const { data: trxReceipt, isLoading: isWaiting } = useWaitForTransaction({
    hash: result?.hash,
    enabled: !!result?.hash,
  });

  useEffect(() => {
    if (error) {
      notification.error({ message: error.message });
    }
  }, [error]);

  return {
    unlock: write,
    isLoading: isLoading || isWaiting,
    trxReceipt,
    error,
  };
}

// async function createPermitSignature(tokenOwner, spender, value, deadline) {
//   const nonce = await WSDM.nonces(tokenOwner.address);
//   return createPermitSignatureWithNonce(tokenOwner, spender, value, nonce, deadline)
// }
//
// async function createPermitSignatureWithNonce(tokenOwner, spender, value, nonce, deadline) {
//   const chainId = (await ethers.provider.getNetwork()).chainId;
//   const domain = {
//     name: await WSDM.name(),
//     version: "1",
//     chainId: chainId,
//     verifyingContract: WSDM.address
//   };
//
//   const types = {
//     Permit: [{name: "owner",type: "address"},
//       {name: "spender",type: "address"},
//       {name: "value",type: "uint256"},
//       {name: "nonce",type: "uint256"},
//       {name: "deadline",type: "uint256"},
//     ],
//   };
//
//   const values = {
//     owner: tokenOwner.address,
//     spender: spender.address,
//     value: value,
//     nonce: nonce,
//     deadline: deadline,
//   };
//
//   // sign the Permit type data with the deployer's private key
//   const signature = await tokenOwner._signTypedData(domain, types, values);
//
//   // split the signature into its components
//   const sig = ethers.utils.splitSignature(signature);
//   return sig;
// }
//
// const deadline = await time.latest() + 3600;
// const sig = await createPermitSignature(user1, Locking, user1LockBalance, deadline);
