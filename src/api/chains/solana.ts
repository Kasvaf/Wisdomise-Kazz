import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { fromBigMoney, toBigMoney } from 'utils/money';

const CONTRACT_ADDRESSES = {
  'wrapped-solana': 'So11111111111111111111111111111111111111112',
  'tether': 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  'usd-coin': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
} as const;

const CONTRACT_DECIMAL = {
  'wrapped-solana': 9,
  'usd-coin': 6,
  'tether': 6,
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

  return useQuery({
    queryKey: ['sol-balance', quote, publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey || !quote) return null;

      try {
        if (quote === 'wrapped-solana') {
          return Number(
            fromBigMoney(await connection.getBalance(publicKey), 9),
          );
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
          return Number(
            fromBigMoney(balance.value.amount, balance.value.decimals),
          );
        }
      } catch (error) {
        if ((error as any)?.code === -32_602) {
          // Invalid param: could not find account -> no transactions yet
          return 0;
        }
        throw new Error((error as any)?.message || 'Cannot read user balance');
      }
    },
    refetchInterval: 10_000,
    staleTime: 500,
  });
};

export const useSolanaTransferAssetsMutation = (
  quote?: AutoTraderSolanaSupportedQuotes,
) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const queryClient = useQueryClient();

  return async ({
    recipientAddress,
    amount,
    gasFee,
  }: {
    recipientAddress: string;
    amount: string;
    gasFee: string;
  }) => {
    if (!signTransaction || !publicKey || !quote)
      throw new Error('Wallet not connected');
    const tokenMint = new PublicKey(CONTRACT_ADDRESSES[quote]);
    const transaction = new Transaction();

    if (quote === 'wrapped-solana') {
      // Native SOL transfer
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipientAddress),
          lamports: toBigMoney(amount, 9),
        }),
      );
    } else {
      // SPL Token transfer

      // get user's Associated Token Account
      const userATA = getAssociatedTokenAddressSync(
        tokenMint,
        publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      // get recipient's Associated Token Account
      const recipientATA = getAssociatedTokenAddressSync(
        tokenMint,
        new PublicKey(recipientAddress),
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      // If recipient's ATA doesn't exist, create it
      transaction.add(
        createAssociatedTokenAccountIdempotentInstruction(
          publicKey, // payer
          recipientATA, // ata
          new PublicKey(recipientAddress), // owner
          tokenMint, // mint
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        ),
      );

      // Add token transfer instruction
      transaction.add(
        createTransferInstruction(
          userATA,
          recipientATA,
          publicKey,
          toBigMoney(amount, CONTRACT_DECIMAL[quote]),
          [],
          TOKEN_PROGRAM_ID,
        ),
      );
    }

    // Add gas fee reserve transfer in the same transaction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(recipientAddress),
        lamports: toBigMoney(gasFee, 9),
      }),
    );

    try {
      // Get latest blockhash
      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = publicKey;

      // Sign and send transaction
      // const signature =
      const signedTransaction = await signTransaction(transaction);
      await connection.sendRawTransaction(signedTransaction.serialize());

      // Wait for confirmation
      // await connection.confirmTransaction({
      //   signature,
      //   blockhash: latestBlockhash.blockhash,
      //   lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      // });

      await queryClient.invalidateQueries({ queryKey: ['sol-balance'] });
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  };
};

export function useAwaitSolanaWalletConnection() {
  const { connected } = useWallet();
  const resolver = useRef<((val: boolean) => void) | null>(null);
  const promiseRef = useRef<Promise<boolean> | null>(null);
  const solanaModal = useWalletModal();

  // Effect to resolve any pending promise when connected
  useEffect(() => {
    if (resolver.current && (connected || !solanaModal.visible)) {
      resolver.current(connected);
      resolver.current = null;
      promiseRef.current = null;
    }
  }, [connected, solanaModal.visible]);

  // This returns a fresh promise every time you want to wait for a connection
  const awaitConnection = useCallback(() => {
    if (!promiseRef.current) {
      promiseRef.current = new Promise(resolve => {
        resolver.current = resolve;
      });
      solanaModal.setVisible(true);
    }
    return promiseRef.current;
  }, [solanaModal]);

  return awaitConnection;
}
