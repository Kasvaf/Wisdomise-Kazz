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
import { type Provider } from '@reown/appkit-adapter-solana/react';
import { useAppKitProvider } from '@reown/appkit/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fromBigMoney, toBigMoney } from 'utils/money';
import { usePendingPositionInCache } from 'api/trader';
import { useSymbolInfo } from 'api/symbol';
import { ofetch } from 'config/ofetch';
import { useActiveWallet } from 'api/chains/wallet';
import { useSolanaConnection } from 'api/chains/connection';
import { queryBatchCandles, useUSDCLastPrice, useUSDTLastPrice } from 'api';
import { queryContractSlugs } from './utils';

export type AutoTraderSolanaSupportedQuotes =
  | 'tether'
  | 'usd-coin'
  | 'wrapped-solana';

export const SOLANA_CONTRACT_ADDRESS =
  'So11111111111111111111111111111111111111112';
export const USDC_CONTRACT_ADDRESS =
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

const useContractInfo = (slug?: string) => {
  const { data } = useSymbolInfo(slug);
  const netInfo = data?.networks.find(x => x.network.slug === 'solana');
  return useQuery({
    queryKey: ['sol-contract-info', slug],
    queryFn: async () => {
      if (slug === 'wrapped-solana') {
        return {
          contract: SOLANA_CONTRACT_ADDRESS,
          decimals: 9,
        };
      }
      return {
        contract: netInfo?.contract_address,
        decimals: netInfo?.decimals,
      };
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!slug && !!netInfo,
  });
};

export const useSolanaAccountBalance = (slug?: string, address?: string) => {
  const { address: activeAddress } = useActiveWallet();
  const { data: { contract } = {}, isLoading: contractIsLoading } =
    useContractInfo(slug);
  const connection = useSolanaConnection();

  const addr = address ?? activeAddress;

  const query = useQuery({
    queryKey: ['sol-balance', slug, addr],
    queryFn: async () => {
      if (!addr || !slug || !contract) return null;
      const publicKey = new PublicKey(addr);

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
    staleTime: 10_000,
    enabled: !!contract,
  });

  return {
    ...query,
    isLoading: query.isLoading || contractIsLoading,
  };
};

export const useSolanaUserAssets = (address?: string) => {
  const { address: activeAddress } = useActiveWallet();
  const addr = address ?? activeAddress;
  const { data: usdtPrice, isPending: p1 } = useUSDTLastPrice();
  const { data: usdcPrice, isPending: p2 } = useUSDCLastPrice();
  const connection = useSolanaConnection();

  const query = useQuery({
    queryKey: ['solana-user-assets', addr],
    queryFn: async () => {
      if (!addr || !connection) return [];
      const publicKey = new PublicKey(addr);

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
          address: x.address,
          amount: x.amount,
        }));

        // Add native SOL to the list
        if (solBalance > 9) {
          assetBalances.unshift({
            network: 'solana',
            slug: 'solana',
            address: SOLANA_CONTRACT_ADDRESS,
            amount: +fromBigMoney(solBalance, 9),
          });
        }

        if (assetBalances.length === 0) {
          return [];
        }

        const bases = assetBalances?.map(c => c.address);
        const quotes = assetBalances?.map(c =>
          c.slug === 'solana' ? USDC_CONTRACT_ADDRESS : SOLANA_CONTRACT_ADDRESS,
        );

        const batchRes = await queryBatchCandles({
          bases,
          quotes,
          network: 'solana',
          resolution: '1h',
        });

        return assetBalances
          .filter(x => x.slug)
          ?.map(a => ({
            ...a,
            usd_equity:
              ((a.slug === 'tether'
                ? usdtPrice
                : a.slug === 'usd-coin'
                ? usdcPrice
                : batchRes?.responses?.find(
                    res => res.symbol.base === a.address,
                  )?.candles?.[0]?.close) ?? 0) * a.amount,
          }));
      } catch (error) {
        console.error('Error fetching token accounts:', error);
        throw new Error('Failed to fetch user assets');
      }
    },
    refetchInterval: 30_000, // Refresh every 30 seconds
    staleTime: 30_000,
    enabled: !!addr && isValidSolanaAddress(addr) && !!usdtPrice && !!usdcPrice,
  });

  return {
    ...query,
    isPending: query.isPending || p1 || p2,
  };
};

export const useBalanceInUSD = (address?: string) => {
  const { data: assets, isPending } = useSolanaUserAssets(address);
  return {
    balance: isPending
      ? 0
      : assets?.reduce((sum, curr) => (sum += curr.usd_equity), 0) ?? 0,
    isPending,
  };
};

export const useSolanaTransferAssetsMutation = (slug?: string) => {
  const { walletProvider } = useAppKitProvider<Provider>('solana');
  const { address } = useActiveWallet();
  const queryClient = useQueryClient();
  const { data: { contract, decimals } = {} } = useContractInfo(slug);
  const awaitPositionInCache = usePendingPositionInCache();
  const connection = useSolanaConnection();

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
    if (!connection || !address || !slug || !contract || !decimals)
      throw new Error('Wallet not connected');

    const publicKey = new PublicKey(address);
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
      const signature =
        await walletProvider.signAndSendTransaction(transaction);

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
            abortSignal: timeoutSignal(),
          })
          .then(x => x.value.err == null)
          .finally(() => {
            void queryClient.invalidateQueries({ queryKey: ['sol-balance'] });
          });

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
  const { walletProvider } = useAppKitProvider<Provider>('solana');
  const { address, isCustodial } = useActiveWallet();
  const connection = useSolanaConnection();
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    void queryClient.invalidateQueries({ queryKey: ['sol-balance'] });
    void queryClient.invalidateQueries({
      queryKey: ['solana-user-assets'],
    });
  };

  return async (
    base: string,
    quote: string,
    side: 'LONG' | 'SHORT',
    amount: string,
  ) => {
    if (!address) throw new Error('Wallet not connected');
    const publicKey = new PublicKey(address);

    const swap = ofetch<SwapResponse>('/trader/swap', {
      method: 'post',
      body: {
        pair_slug: base + '/' + quote,
        side,
        amount,
        network_slug: 'solana',
        wallet_address: publicKey.toString(),
      },
    });
    if (isCustodial) {
      return async () => {
        const res = !!(await swap);
        setTimeout(() => invalidateQueries(), 5000); // Possibly the transaction is confirmed after this
        return res;
      };
    }

    if (!connection) throw new Error('Appkit connection not found');

    const [
      { key, instructions, lookup_table_address: lookupTableAddresses },
      latestBlockhash,
    ] = await Promise.all([swap, connection.getLatestBlockhash()]);

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

    const signature = await walletProvider.signAndSendTransaction(transaction);

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
          abortSignal: timeoutSignal(),
        })
        .then(x => x.value && x.value.err == null)
        .finally(() => {
          invalidateQueries();
        });
  };
};

const timeoutSignal = (timeout = 7000) => {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), timeout);
  return abortController.signal;
};

function isValidSolanaAddress(address: string): boolean {
  try {
    const _pk = new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}
