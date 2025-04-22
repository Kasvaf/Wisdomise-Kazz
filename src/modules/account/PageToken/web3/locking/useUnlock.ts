// import { useWaitForTransaction } from 'wagmi';
// import { useEffect } from 'react';
// import { notification } from 'antd';
// import { useWriteUnlock } from 'modules/account/PageToken/web3/locking/contract';
// import { extractWagmiErrorMessage } from 'utils/error';
//
// export function useUnlock() {
//   const { write, data: result, isLoading, error } = useWriteUnlock();
//   const { data: trxReceipt, isLoading: isWaiting } = useWaitForTransaction({
//     hash: result?.hash,
//     enabled: !!result?.hash,
//   });
//
//   useEffect(() => {
//     if (error) {
//       notification.error({ message: extractWagmiErrorMessage(error.message) });
//     }
//   }, [error]);
//
//   return {
//     unlock: write,
//     isLoading: isLoading || isWaiting,
//     trxReceipt,
//     error,
//   };
// }
// eslint-disable-next-line unicorn/no-empty-file
