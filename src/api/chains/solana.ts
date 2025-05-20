import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  type AddressLookupTableAccount,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { fromBigMoney, toBigMoney } from 'utils/money';
import { usePendingPositionInCache } from 'api/trader';
import { useSymbolInfo } from 'api/symbol';
import { ofetch } from 'config/ofetch';
import { queryContractSlugs, usePromiseOfEffect } from './utils';

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
          const mint = new PublicKey(contract);
          const accountInfo = await connection.getAccountInfo(mint);
          if (!accountInfo) return 0;

          // Get the token account info
          const balance = await connection.getTokenAccountBalance(
            getAssociatedTokenAddressSync(
              mint,
              publicKey,
              false,
              accountInfo.owner,
            ),
          );

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

export const useSolanaUserAssets = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ['solana-user-assets', publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey) return [];

      try {
        const [solBalance, tokenAccounts, token2022Accounts] =
          await Promise.all([
            // native SOL balance
            connection.getBalance(publicKey),

            // all token accounts owned by the user
            connection.getParsedTokenAccountsByOwner(publicKey, {
              programId: TOKEN_PROGRAM_ID,
            }),

            connection.getParsedTokenAccountsByOwner(publicKey, {
              programId: TOKEN_2022_PROGRAM_ID,
            }),
          ]);

        // Map token accounts to a more usable format
        const assets = [...tokenAccounts.value, ...token2022Accounts.value]
          .map(account => {
            const { mint, tokenAmount } = account.account.data.parsed.info;
            return {
              address: mint,
              amount: +fromBigMoney(tokenAmount.amount, tokenAmount.decimals),
            };
          })
          .filter(token => Number(token.amount) > 0);

        const slugOf = await queryContractSlugs(assets.map(x => x.address));
        const assetBalances = assets.map(x => ({
          network: 'solana',
          slug: slugOf[x.address],
          amount: x.amount,
        }));

        // Add native SOL to the list
        if (solBalance > 9) {
          assetBalances.unshift({
            network: 'solana',
            slug: 'solana',
            amount: +fromBigMoney(solBalance, 9),
          });
        }

        return assetBalances.filter(x => x.slug);
      } catch (error) {
        console.error('Error fetching token accounts:', error);
        throw new Error('Failed to fetch user assets');
      }
    },
    refetchInterval: 30_000, // Refresh every 30 seconds
    staleTime: 5000,
    enabled: !!publicKey,
  });
};

export const useSolanaTransferAssetsMutation = (slug?: string) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const queryClient = useQueryClient();
  const { data: { contract, decimals } = {} } = useContractInfo(slug);
  const awaitPositionInCache = usePendingPositionInCache();

  return async ({
    positionKey,
    recipientAddress,
    amount,
    gasFee,
  }: {
    positionKey: string;
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
      const accountInfo = await connection.getAccountInfo(tokenMint);
      if (!accountInfo) throw new Error('unknown token');

      // get user's Associated Token Account
      const userATA = getAssociatedTokenAddressSync(
        tokenMint,
        publicKey,
        false,
        accountInfo.owner,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      // get recipient's Associated Token Account
      const recipientATA = getAssociatedTokenAddressSync(
        tokenMint,
        new PublicKey(recipientAddress),
        false,
        accountInfo.owner,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      // If recipient's ATA doesn't exist, create it
      transaction.add(
        createAssociatedTokenAccountIdempotentInstruction(
          publicKey, // payer
          recipientATA, // ata
          new PublicKey(recipientAddress), // owner
          tokenMint, // mint
          accountInfo.owner,
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
          accountInfo.owner,
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
      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
      );

      void queryClient.invalidateQueries({ queryKey: ['sol-balance'] });

      return () => {
        const cacheWaiter = awaitPositionInCache({
          slug,
          positionKey,
        });

        // Wait for confirmation
        const networkConfirmation = connection
          .confirmTransaction({
            signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
          })
          .then(x => x.value.err == null);

        return Promise.race([cacheWaiter, networkConfirmation]).finally(
          cacheWaiter.stop,
        );
      };
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  };
};

interface SwapResponse {
  key: string;
  instructions: Instruction[];
  lookup_table_address?: string[];
}

interface Instruction {
  programId: string;
  accounts: Account[];
  data: number[];
}

interface Account {
  pubkey: string;
  is_signer: boolean;
  is_writable: boolean;
}

// gas-fee: 0.005
export const useSolanaMarketSwap = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const queryClient = useQueryClient();

  return async ({
    pairSlug,
    side,
    amount,
  }: {
    pairSlug: string;
    side: 'LONG' | 'SHORT';
    amount: string;
  }) => {
    if (!signTransaction || !publicKey) throw new Error('Wallet not connected');

    const [
      { key, instructions, lookup_table_address: lookupTableAddresses },
      latestBlockhash,
    ] = await Promise.all([
      ofetch<SwapResponse>('/trader/swap', {
        method: 'post',
        body: {
          pair_slug: pairSlug,
          side,
          amount,
          network_slug: 'solana',
          wallet_address: publicKey.toString(),
        },
      }),
      connection.getLatestBlockhash(),
    ]);

    // Fetch the address lookup tables if provided
    const lookupTableAccounts = (
      await Promise.all(
        (lookupTableAddresses || []).map(
          async address =>
            (await connection.getAddressLookupTable(new PublicKey(address)))
              .value || null,
        ),
      )
    ).filter((table): table is AddressLookupTableAccount => table != null);

    // Create a versioned transaction
    const transaction = new VersionedTransaction(
      new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: instructions.map(
          inst =>
            new TransactionInstruction({
              programId: new PublicKey(inst.programId),
              data: Buffer.from(inst.data),
              keys: inst.accounts.map(acc => ({
                pubkey: new PublicKey(acc.pubkey),
                isSigner: acc.is_signer,
                isWritable: acc.is_writable,
              })),
            }),
        ),
      }).compileToV0Message(lookupTableAccounts),
    );

    const signedTransaction = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize(),
    );

    void queryClient.invalidateQueries({ queryKey: ['sol-balance'] });
    void queryClient.invalidateQueries({ queryKey: ['solana-user-assets'] });

    await ofetch<SwapResponse>('/trader/swap/' + key, {
      method: 'patch',
      body: { transaction_hash: signature },
    });

    return () =>
      connection
        .confirmTransaction({
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        })
        .then(x => x.value.err == null);
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
