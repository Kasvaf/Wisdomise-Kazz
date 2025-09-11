import { useSupportedPairs } from 'api';
import { SOLANA_CONTRACT_ADDRESS } from 'api/chains/constants';
import { useAllWallets } from 'api/chains/wallet';
import { useGrpc } from 'api/grpc-v2';
import type { Swap } from 'api/proto/delphinus';
import { bxTransfer } from 'boxicons-quasar';
import clsx from 'clsx';
import {
  BtnConvertToUsd,
  SolanaCoin,
} from 'modules/autoTrader/CoinSwapActivity';
import { openInScan } from 'modules/autoTrader/PageTransactions/TransactionBox/components';
import { usePausedData } from 'modules/autoTrader/usePausedData';
import { useActiveNetwork } from 'modules/base/active-network';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { Wallet } from 'modules/discovery/DetailView/WhaleDetail/Wallet';
import { useMemo, useRef } from 'react';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { ReadableDate } from 'shared/ReadableDate';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Button } from 'shared/v1-components/Button';
import { Table } from 'shared/v1-components/Table';
import { uniqueBy } from 'utils/uniqueBy';
import { ReactComponent as UserIcon } from './user.svg';

export const useAssetEnrichedSwaps = ({
  asset,
  network,
  wallets,
  enabled = true,
}: {
  asset?: string;
  wallets?: string[];
  network: string;
  enabled?: boolean;
}) => {
  const { data: history, isLoading } = useGrpc({
    service: 'delphinus',
    method: 'swapsHistory',
    payload: {
      network,
      asset,
    },
    enabled,
    history: 0,
  });

  const { history: recent } = useGrpc({
    service: 'delphinus',
    method: 'swapsStream',
    payload: {
      network,
      asset,
      wallets,
    },
    enabled,
    history: Number.POSITIVE_INFINITY,
  });

  const data = useMemo(() => {
    const swaps = uniqueBy(
      [...(recent?.map(x => x.swap) ?? []), ...(history?.swaps ?? [])]
        .filter((x): x is Swap => !!x)
        .sort((a, b) => +new Date(b.relatedAt) - +new Date(a.relatedAt)),
      x => x.id,
    );

    return swaps.map(row => {
      const dir = row.toAsset === SOLANA_CONTRACT_ADDRESS ? 'sell' : 'buy';
      const price = +(
        (dir === 'sell' ? row.fromAssetPrice : row.toAssetPrice) ?? '0'
      );

      const tokenAddress = dir === 'sell' ? row.fromAsset : row.toAsset;
      const tokenAmount = +(dir === 'sell' ? row.fromAmount : row.toAmount);
      const solAmount = +(dir === 'sell' ? row.toAmount : row.fromAmount);
      return {
        ...row,
        dir,
        price,
        tokenAmount,
        solAmount,
        tokenAddress,
      };
    });
  }, [history, recent]);

  return {
    data,
    isLoading,
  };
};

const AssetSwapsStream: React.FC<{ id?: string; className?: string }> = ({
  id,
  className,
}) => {
  const { symbol, marketData } = useUnifiedCoinDetails();
  const network = useActiveNetwork();
  const asset = symbol.contractAddress!;
  const slug = symbol.slug;

  const containerRef = useRef<HTMLDivElement>(null);
  const { settings, updateSwapsPartial } = useUserSettings();
  const wallets = useAllWallets();

  const { data: pairs, isPending } = useSupportedPairs(slug);

  const hasSolanaPair =
    !isPending && pairs?.some(p => p.quote.slug === 'wrapped-solana');

  const totalSupply = marketData.totalSupply ?? 0;
  const showAmountInUsd = hasSolanaPair
    ? settings.swaps.show_amount_in_usd
    : true;
  const showMarketCap = settings.swaps.show_market_cap;

  const enabled = !!network && !!asset;
  const { data, isLoading } = useAssetEnrichedSwaps({
    network,
    asset,
    enabled,
  });

  const { data: pausedData, isPaused } = usePausedData(data, containerRef);

  const maxAmount = pausedData.reduce((max, s) => {
    return Math.max(max, s.tokenAmount);
  }, 0);

  return (
    <div className={clsx(className)} id={id!} ref={containerRef}>
      <Table
        columns={[
          {
            title: (
              <div className="flex items-center gap-1">
                Amount
                <BtnConvertToUsd
                  disabled={!hasSolanaPair}
                  isUsd={showAmountInUsd}
                  onChange={() =>
                    updateSwapsPartial({ show_amount_in_usd: !showAmountInUsd })
                  }
                />
              </div>
            ),
            key: 'amount',
            render: row => (
              <div className="flex items-center">
                <div
                  className={clsx(
                    row.dir === 'sell'
                      ? 'to-v1-background-negative/20'
                      : 'to-v1-background-positive/20',
                    'absolute left-0 h-full min-w-1 rounded-l-xl bg-gradient-to-r from-0% from-transparent to-60%',
                  )}
                  style={{ width: `${(row.tokenAmount / maxAmount) * 100}%` }}
                />
                {!showAmountInUsd && <SolanaCoin />}
                <DirectionalNumber
                  className="text-xs"
                  direction={row.dir === 'sell' ? 'down' : 'up'}
                  format={{
                    decimalLength: 1,
                  }}
                  label={showAmountInUsd ? '$' : ''}
                  showIcon={false}
                  showSign={false}
                  value={
                    showAmountInUsd
                      ? row.tokenAmount * row.price
                      : row.solAmount
                  }
                />
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center gap-1">
                {showMarketCap ? 'MC' : 'Price'}
                <Button
                  className="text-white/50"
                  fab
                  onClick={() =>
                    updateSwapsPartial({ show_market_cap: !showMarketCap })
                  }
                  size="3xs"
                  variant="ghost"
                >
                  <Icon className="[&>svg]:!size-4" name={bxTransfer} />
                </Button>
              </div>
            ),
            key: 'price',
            render: row => (
              <ReadableNumber
                className="text-xs"
                format={{
                  decimalLength: 2,
                }}
                label="$"
                value={row.price * (showMarketCap ? totalSupply : 1)}
              />
            ),
          },
          {
            title: 'Trader',
            key: 'trader',
            render: row => (
              <div className="relative flex items-center gap-1">
                {wallets.includes(row.wallet) && (
                  <HoverTooltip className="mb-4" title="You">
                    <UserIcon className="-left-3 absolute size-4 text-v1-content-brand" />
                  </HoverTooltip>
                )}
                <Wallet
                  className="text-xs [&_img]:hidden"
                  formatter={address => address.slice(-3)}
                  noLink
                  wallet={{
                    address: row.wallet,
                    network: symbol.network!,
                  }}
                  whale={false}
                />
              </div>
            ),
          },
          {
            title: 'Age',
            key: 'age',
            width: 30,
            render: row => (
              <button onClick={() => openInScan('solana', { tx: row.txId })}>
                <ReadableDate
                  className="text-xs hover:underline"
                  suffix=""
                  value={row.relatedAt}
                />
              </button>
            ),
          },
        ]}
        dataSource={pausedData}
        isPaused={isPaused}
        loading={isLoading}
        rowClassName="relative"
        scrollable
        size="sm"
        surface={1}
      />
    </div>
  );
};

export default AssetSwapsStream;
