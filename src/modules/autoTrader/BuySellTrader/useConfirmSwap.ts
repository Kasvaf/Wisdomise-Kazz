import type { BlockhashWithExpiryBlockHeight } from '@solana/web3.js';
import { useQueryClient } from '@tanstack/react-query';
import type { Swap, SwapStatus } from 'api';
import { useSolanaConnection } from 'api/chains/connection';
import { ofetch } from 'config/ofetch';

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
  const getSignature = async (swapKey: string) => {
    let fetchAttempts = 0;

    const extractSignature = (urlStr: string) => {
      const url = new URL(urlStr);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      return pathSegments[1];
    };

    return new Promise<{ signature: string; status: SwapStatus }>(
      (resolve, reject) => {
        const fetchSwaps = async () => {
          console.log('fetch swap', fetchAttempts, Date.now());

          if (fetchAttempts === 10) {
            clearInterval(intervalId);
            reject('Signature not found');
          }

          fetchAttempts++;
          const swap = await ofetch<Swap>(`/trader/swap/${swapKey}`, {
            method: 'get',
          });
          console.log('swap fetched', Date.now());
          const signature = swap
            ? extractSignature(swap.transaction_link)
            : null;
          if (signature && signature !== 'None') {
            clearInterval(intervalId);
            console.log(swap?.status);
            console.log('signature', signature, Date.now());
            resolve({ signature, status: swap.status });
          }
        };

        fetchSwaps();
        const intervalId = setInterval(fetchSwaps, 1000);
      },
    );
  };

  return { getSignature };
};
