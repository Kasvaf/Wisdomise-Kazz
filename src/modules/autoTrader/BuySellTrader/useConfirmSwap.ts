import type { BlockhashWithExpiryBlockHeight } from '@solana/web3.js';
import { useQueryClient } from '@tanstack/react-query';
import { useSolanaConnection } from 'api/chains/connection';

export const useConfirmTransaction = () => {
  const connection = useSolanaConnection();
  const queryClient = useQueryClient();

  const confirm = async ({
    slug,
    signature,
    latestBlockhash,
  }: {
    slug: string;
    latestBlockhash: BlockhashWithExpiryBlockHeight;
    signature: string;
  }) => {
    const invalidateQueries = () => {
      let fetchAttempts = 0;
      void queryClient.invalidateQueries({ queryKey: ['sol-balance'] });
      void queryClient.invalidateQueries({
        queryKey: ['solana-user-assets'],
      });
      void queryClient.invalidateQueries({ queryKey: ['buys-sells'] });

      void queryClient.invalidateQueries({ queryKey: ['trader-asset', slug] });
      const intervalId = setInterval(() => {
        if (fetchAttempts <= 10) {
          void queryClient.invalidateQueries({
            queryKey: ['trader-asset', slug],
          });
          fetchAttempts++;
        } else {
          clearInterval(intervalId);
        }
      }, 1000);
    };

    const timoutSignal = (timeout = 20_000) => {
      const abortController = new AbortController();
      setTimeout(() => abortController.abort(), timeout);
      return abortController.signal;
    };

    return connection
      .confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        abortSignal: timoutSignal(),
      })
      .then(x => x.value && x.value.err == null)
      .catch(error => {
        console.error(error);
        throw new Error('Could not confirm transaction');
      })
      .finally(() => {
        invalidateQueries();
      });
  };

  return { confirm };
};
