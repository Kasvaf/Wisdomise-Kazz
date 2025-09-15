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
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Wallet } from '../WhaleDetail/Wallet';
import { useUnifiedCoinDetails } from './lib';

const SharedTable: FC<{
  type: 'holders' | 'traders';
  grpcState:
    | GrpcState<TopHolderStreamResponse>
    | GrpcState<TopTraderStreamResponse>;
}> = ({ type, grpcState: resp }) => {
  const [globalNetwork] = useGlobalNetwork();
  const columns = useMemo<Array<TableColumn<WalletUpdate>>>(
    () => [
      {
        title: 'Address',
        // sticky: 'start',
        render: row => (
          <Wallet
            className="[&_img]:hidden"
            noLink
            wallet={{
              address: row.walletAddress,
              network: globalNetwork,
            }}
            whale={false}
          />
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
              className="text-v1-content-secondary text-xxs"
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
              className="text-v1-content-secondary text-xxs"
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
        render: row => (
          <div className="flex flex-col items-start gap-px">
            <ReadableNumber
              className="text-xs"
              label="$"
              popup="never"
              value={row.balance}
            />
            <DirectionalNumber
              className="text-xxs"
              label="%"
              popup="never"
              showIcon={false}
              showSign
              suffix="(7D)"
              value={(row.balance - row.balanceFirst) / (row.balance / 100)}
            />
          </div>
        ),
      },
    ],
    [type, globalNetwork],
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
