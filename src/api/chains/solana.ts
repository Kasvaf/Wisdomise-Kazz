import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useQuery } from '@tanstack/react-query';

const CONTRACT_ADDRESSES = {
  'wrapped-solana': 'So11111111111111111111111111111111111111112',
  'tether': 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  'usd-coin': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
} as const;

export type AutoTraderSolanaSupportedQuotes =
  | 'tether'
  | 'usd-coin'
  | 'wrapped-solana';

export const useSolanaAccountBalance = (
  quote?: AutoTraderSolanaSupportedQuotes,
) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  return useQuery(
    ['sol-balance'],
    async () => {
      if (!publicKey || !quote) return null;

      try {
        if (quote === 'wrapped-solana') {
          return await connection.getBalance(publicKey);
        } else {
          // Get the associated token address
          const tokenAddress = await getAssociatedTokenAddress(
            new PublicKey(CONTRACT_ADDRESSES[quote]),
            publicKey,
            false,
            TOKEN_PROGRAM_ID,
          );

          // Get the token account info
          const balance = await connection.getTokenAccountBalance(tokenAddress);

          // Return the balance as a number
          return (
            Number(balance.value.amount) / Math.pow(10, balance.value.decimals)
          );
        }
      } catch {
        return null;
      }
    },
    {
      enabled: Boolean(quote && connection && publicKey),
      refetchInterval: 10_000,
    },
  );
};

export const useSolanaTransferAssetsMutation = (
  quote?: AutoTraderSolanaSupportedQuotes,
) => {
  return async ({
    recipientAddress,
    amount,
    gasFee,
  }: {
    recipientAddress: string;
    amount: string;
    gasFee: string;
  }) => {
    console.log(quote, recipientAddress, amount, gasFee);
    throw new Error('not implemented');
  };
};
