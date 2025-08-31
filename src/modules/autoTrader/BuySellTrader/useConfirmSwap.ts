import type { BlockhashWithExpiryBlockHeight } from '@solana/web3.js';
import { useQueryClient } from '@tanstack/react-query';
import { useTraderSwapsQuery } from 'api';
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
      void queryClient.invalidateQueries({ queryKey: ['sol-balance'] });
      void queryClient.invalidateQueries({
        queryKey: ['solana-user-assets'],
      });
      void queryClient.invalidateQueries({ queryKey: ['buys-sells'] });
      void queryClient.invalidateQueries({ queryKey: ['trader-asset', slug] });
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

export const useSwapSignature = () => {
  const { refetch, dataUpdatedAt } = useTraderSwapsQuery({});

  const getSignature = async (swapKey: string) => {
    let fetchAttempts = 0;
    const extractSignature = (urlStr: string) => {
      const url = new URL(urlStr);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      console.log(pathSegments[1]);
      return pathSegments[1];
    };

    return new Promise<string>((resolve, reject) => {
      const fetchSwaps = async () => {
        if (Date.now() - dataUpdatedAt < 1000) return;

        if (fetchAttempts === 10) {
          clearInterval(intervalId);
          reject('Signature not found');
        }
        fetchAttempts++;
        const { data: swaps } = await refetch();
        const swap = swaps?.results.find(s => s.key === swapKey);
        const signature = swap ? extractSignature(swap.transaction_link) : null;
        if (signature && signature !== 'None') {
          clearInterval(intervalId);
          resolve(signature);
        }
      };

      const intervalId = setInterval(fetchSwaps, 1000);
    });
  };

  return { getSignature };
};
