import { type GrpcState, useGrpc } from 'api/grpc-v2';
import type {
  TopHolderStreamResponse,
  TopTraderStreamResponse,
  WalletUpdate,
} from 'api/proto/network_radar';
import { clsx } from 'clsx';
import { type FC, useMemo } from 'react';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Wallet } from 'shared/v1-components/Wallet';
import { useUnifiedCoinDetails } from './lib';

const SharedTable: FC<{
  type: 'holders' | 'traders';
  grpcState:
    | GrpcState<TopHolderStreamResponse>
    | GrpcState<TopTraderStreamResponse>;
}> = ({ type, grpcState: resp }) => {
  const {
    marketData: { currentPrice, totalSupply },
  } = useUnifiedCoinDetails();
  const columns = useMemo<Array<TableColumn<WalletUpdate>>>(
    () => [
      {
        title: 'Address',
        render: row => (
          <Wallet address={row.walletAddress} className="text-xs" mode="name" />
        ),
      },
      {
        title: 'Bought',
        render: row => (
          <div className="flex flex-col gap-px">
            <ReadableNumber
              className="text-xs"
              label="$"
              popup="never"
              value={row.volumeInflow}
            />
            <ReadableNumber
              className="text-2xs text-v1-content-secondary"
              format={{
                compactInteger: false,
              }}
              label="TXs"
              popup="never"
              value={row.numInflows}
            />
          </div>
        ),
      },
      {
        title: 'Sold',
        render: row => (
          <div className="flex flex-col gap-px">
            <ReadableNumber
              className="text-xs"
              label="$"
              popup="never"
              value={row.volumeOutflow}
            />
            <ReadableNumber
              className="text-2xs text-v1-content-secondary"
              format={{
                compactInteger: false,
              }}
              label="TXs"
              popup="never"
              value={row.numOutflows}
            />
          </div>
        ),
      },
      // {
      //   title: 'PnL',
      //   render: row => (
      //     <DirectionalNumber
      //       className="text-xs"
      //       label="$"
      //       popup="never"
      //       showIcon={false}
      //       showSign
      //       value={row.pnl}
      //     />
      //   ),
      // },
      {
        title: 'Realized PnL',
        render: row => (
          <DirectionalNumber
            className="text-xs"
            label="$"
            popup="never"
            showIcon={false}
            showSign
            value={row.realizedPnl}
          />
        ),
      },
      {
        title: 'Avg Cost',
        render: row => (
          <ReadableNumber
            className="text-xs"
            label="$"
            popup="never"
            value={row.averageBuy}
          />
        ),
      },
      {
        hidden: type === 'traders',
        title: 'Balance',
        render: row => {
          const percentage = (row.balance / (totalSupply ?? 1)) * 100;
          return (
            <div className="flex flex-col items-start gap-px">
              <div className="flex items-center gap-1">
                <ReadableNumber
                  className="text-xs"
                  label="$"
                  popup="never"
                  value={row.balance * (currentPrice ?? 0)}
                />
                <div className="rounded-md bg-white/10 px-1 text-2xs">
                  <ReadableNumber
                    format={{ decimalLength: 3 }}
                    value={percentage}
                  />
                  %
                </div>
              </div>
              <div className="mt-1 h-1 w-28 overflow-hidden rounded-xl bg-white/10">
                <div
                  className="h-full bg-v1-background-brand"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        },
      },
    ],
    [type, currentPrice, totalSupply],
  );

  return (
    <Table
      columns={columns}
      dataSource={resp.data?.wallets}
      loading={resp.isLoading}
      rowKey={row => row.walletAddress}
      scrollable
      surface={1}
    />
  );
};

export function CoinTopHoldersWidget({
  title,
  id,
  hr,
  className,
}: {
  title?: boolean;
  id?: string;
  hr?: boolean;
  className?: string;
}) {
  const { symbol } = useUnifiedCoinDetails();
  const topHolders = useGrpc({
    service: 'network_radar',
    method: 'topHolderStream',
    payload: {
      network: symbol.network ?? undefined,
      tokenAddress: symbol.contractAddress ?? undefined,
    },
  });

  return (
    <>
      <div
        className={clsx(
          'relative flex flex-col gap-4 overflow-auto overflow-x-hidden',
          className,
        )}
        id={id}
      >
        {title !== false && (
          <h3 className="font-semibold text-sm">Top Holders</h3>
        )}
        <SharedTable grpcState={topHolders} type="holders" />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}

export function CoinTopTradersWidget({
  title,
  id,
  hr,
  className,
}: {
  title?: boolean;
  id?: string;
  hr?: boolean;
  className?: string;
}) {
  const { symbol } = useUnifiedCoinDetails();
  const topTraders = useGrpc({
    service: 'network_radar',
    method: 'topTraderStream',
    payload: {
      network: symbol.network ?? undefined,
      tokenAddress: symbol.contractAddress ?? undefined,
      resolution: '1d',
    },
  });

  return (
    <>
      <div
        className={clsx(
          'relative flex flex-col gap-4 overflow-auto overflow-x-hidden',
          className,
        )}
        id={id}
      >
        {title !== false && (
          <h3 className="font-semibold text-sm">Top Traders</h3>
        )}
        <SharedTable grpcState={topTraders} type="traders" />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
