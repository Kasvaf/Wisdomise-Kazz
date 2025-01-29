import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toBigMoney } from 'utils/money';

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

  return useQuery(
    ['sol-balance'],
    async () => {
      if (!publicKey || !quote) return null;

      try {
        if (quote === 'wrapped-solana') {
          return (await connection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
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
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
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
    if (!publicKey || !quote) throw new Error('Wallet not connected');
    const tokenMint = new PublicKey(CONTRACT_ADDRESSES[quote]);
    console.log(recipientAddress, amount, gasFee);

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

      const [userATA, recipientATA] = await Promise.all([
        /* get user's Associated Token Account */
        getAssociatedTokenAddress(
          tokenMint,
          publicKey,
          false,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        ),
        /* get recipient's Associated Token Account */
        getAssociatedTokenAddress(
          tokenMint,
          new PublicKey(recipientAddress),
          false,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        ),
      ]);

      // Check if recipient's ATA exists
      const recipientATAInfo = await connection.getAccountInfo(recipientATA);

      // If recipient's ATA doesn't exist, create it
      if (!recipientATAInfo) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            recipientATA, // ata
            new PublicKey(recipientAddress), // owner
            tokenMint, // mint
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
          ),
        );
      }

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
      const signature = await sendTransaction(transaction, connection);

      // Wait for confirmation
      await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });

      await queryClient.invalidateQueries(['sol-balance']);
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  };
};
