import { useWriteLock } from 'modules/account/PageToken/web3/locking/contract';
import {
  LOCKING_CONTRACT_ADDRESS,
  WSDM_CONTRACT_ADDRESS,
} from '../../constants';
import { useEnsureAllowance } from '../shared';

// export function useLocking() {
//   const { isLoading: isSigning } = useWsdmSignTypedDataForLocking();
//   const {
//     lockTrxReceipt: lockWithPermitTrxReceipt,
//     isLoading: lockWithPermitIsLoading,
//     isLocking: lockWithPermitIsLocking,
//   } = useLockWithPermit();
//
//   const {
//     startLockingWithApprove,
//     lockTrxReceipt: lockWithApproveTrxReceipt,
//     isLoading: lockWithApproveIsLoading,
//     isLocking: lockWithApproveIsLocking,
//   } = useLockWithApprove();
//
//   const startLocking = async (amount: number, _countdown: number) => {
//     // const deadline = Math.floor(Date.now() / 1000) + countdown;
//     // sign(toBigMoney(amount, 6), deadline)
//     //   .then(signature => {
//     //     startLockingWithPermit(signature, toBigMoney(amount, 6), deadline);
//     //     return null;
//     //   })
//     //   .catch(error => {
//     //     // probably wallet doesn't support eth_signTypedData_v4
//     //     if (!isUserRejectionError(error.message)) {
//     startLockingWithApprove(toBigMoney(amount, 6));
//     //   }
//     // });
//   };
//
//   return {
//     startLocking,
//     isLoading: isSigning || lockWithPermitIsLoading || lockWithApproveIsLoading,
//     isLocking: lockWithPermitIsLocking || lockWithApproveIsLocking,
//     lockTrxReceipt: lockWithPermitTrxReceipt || lockWithApproveTrxReceipt,
//   };
// }

// export function useLockWithPermit() {
//   const {
//     write: lockWithPermit,
//     data: lockResult,
//     isLoading,
//     error,
//   } = useWriteLockWithPermit();
//   const { data: lockTrxReceipt, isLoading: isWaiting } = useWaitForTransaction({
//     hash: lockResult?.hash,
//   });
//
//   const startLockingWithPermit = (
//     signature: `0x${string}`,
//     amount: bigint,
//     deadline: number,
//   ) => {
//     const { r, s } = secp256k1.Signature.fromCompact(signature.slice(2, 130));
//     const v = hexToNumber(`0x${signature.slice(130)}`);
//     lockWithPermit({
//       args: [amount, amount, BigInt(deadline), v, toHex(r), toHex(s)],
//     });
//   };
//
//   useEffect(() => {
//     if (lockTrxReceipt?.status === 'success') {
//       notification.success({
//         message: 'Your tokens are locked successfully',
//       });
//     }
//   }, [lockTrxReceipt]);
//
//   useEffect(() => {
//     if (error) {
//       notification.error({
//         message: extractWagmiErrorMessage(error.message),
//       });
//     }
//   }, [error]);
//
//   return {
//     isLoading: isLoading || isWaiting,
//     isLocking: isWaiting,
//     lockTrxReceipt,
//     startLockingWithPermit,
//   };
// }

export function useLockWithApprove() {
  const {
    writeAndWait: lock,
    isPending: lockingIsPending,
    isWaiting: lockingIsWaiting,
  } = useWriteLock();

  const {
    ensureAllowance,
    isPending: approveIsPending,
    isWaiting: approveIsWaiting,
  } = useEnsureAllowance(WSDM_CONTRACT_ADDRESS, LOCKING_CONTRACT_ADDRESS);

  const lockWithApprove = async (amount: bigint) => {
    const isAllowed = await ensureAllowance(amount);
    if (isAllowed) {
      return await lock(amount);
    }
  };

  return {
    approveIsPending,
    approveIsWaiting,
    lockingIsPending,
    lockingIsWaiting,
    lockWithApprove,
  };
}
