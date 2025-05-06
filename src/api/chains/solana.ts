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
import { useCallback } from 'react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { fromBigMoney, toBigMoney } from 'utils/money';
import { useSymbolInfo } from 'api/symbol';
import { usePromiseOfEffect } from './utils';

export type AutoTraderSolanaSupportedQuotes =
  | 'tether'
  | 'usd-coin'
  | 'wrapped-solana';

const useContractInfo = (slug?: string) => {
  const { connection } = useConnection();
  const { data } = useSymbolInfo(slug);
  const netInfo = data?.networks.find(x => x.network.slug === 'solana');
  return useQuery({
    queryKey: ['sol-contract-info', slug],
    queryFn: async () => {
      if (slug === 'wrapped-solana') {
        return {
          contract: 'So11111111111111111111111111111111111111112',
          decimals: 9,
        };
      }
      if (!netInfo) return;
      if (netInfo.decimals) {
        return {
          contract: netInfo.contract_address,
          decimals: netInfo.decimals,
        };
      }

      const mintPublicKey = new PublicKey(netInfo.contract_address);
      const accountInfo = await connection.getParsedAccountInfo(mintPublicKey);
      const data = accountInfo.value?.data;
      if (
        data &&
        // use type assertion for parsed account data
        typeof data === 'object' &&
        'parsed' in data &&
        data.program === 'spl-token'
      ) {
        return {
          contract: netInfo.contract_address,
          decimals: data.parsed.info.decimals,
        };
      }
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!slug && !!netInfo,
  });
};

export const useSolanaAccountBalance = (slug?: string) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { data: { contract } = {}, isLoading: contractIsLoading } =
    useContractInfo(slug);

  const query = useQuery({
    queryKey: ['sol-balance', slug, publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey || !slug || !contract) return null;

      try {
        if (slug === 'wrapped-solana') {
          return Number(
            fromBigMoney(await connection.getBalance(publicKey), 9),
          );
        } else {
          // Get the associated token address
          const tokenAddress = await getAssociatedTokenAddress(
            new PublicKey(contract),
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
    enabled: !!contract,
  });

  return {
    ...query,
    isLoading: query.isLoading || contractIsLoading,
  };
};

export const useSolanaTransferAssetsMutation = (slug?: string) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction, wallet } = useWallet();
  const queryClient = useQueryClient();
  const { data: { contract, decimals } = {} } = useContractInfo(slug);

  return async ({
    recipientAddress,
    amount,
    gasFee,
  }: {
    recipientAddress: string;
    amount: string;
    gasFee: string;
  }) => {
    if (!signTransaction || !publicKey || !slug || !contract)
      throw new Error('Wallet not connected');
    const tokenMint = new PublicKey(contract);
    const transaction = new Transaction();

    if (slug === 'wrapped-solana') {
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
          toBigMoney(amount, decimals),
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
      const signature = await (async function () {
        if (wallet?.adapter.name === 'Trust') {
          return await sendTransaction(transaction, connection);
        } else {
          const signedTransaction = await signTransaction(transaction);
          return await connection.sendRawTransaction(
            signedTransaction.serialize(),
          );
        }
      })();

      void queryClient.invalidateQueries({ queryKey: ['sol-balance'] });

      return async () => {
        // Wait for confirmation
        const r = await connection.confirmTransaction({
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });
        return r.value.err == null;
      };
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  };
};

export function useAwaitSolanaWalletConnection() {
  const { connected } = useWallet();
  const solanaModal = useWalletModal();
  return usePromiseOfEffect({
    action: useCallback(() => solanaModal.setVisible(true), [solanaModal]),
    done: connected || !solanaModal.visible,
    result: connected,
  });
}
