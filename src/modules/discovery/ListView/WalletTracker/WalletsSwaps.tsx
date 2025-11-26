import clsx from 'clsx';
import { openInScan } from 'modules/autoTrader/PageTransactions/TransactionBox/components';
import { useEnrichedSwaps } from 'modules/autoTrader/useEnrichedSwaps';
import { usePausedData } from 'modules/autoTrader/usePausedData';
import { useActiveNetwork } from 'modules/base/active-network';
import { useTrackedWallets } from 'modules/discovery/ListView/WalletTracker/useTrackedWallets';
import { useMemo, useRef } from 'react';
import { AccessShield } from 'shared/AccessShield';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableDate } from 'shared/ReadableDate';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Table } from 'shared/v1-components/Table';
import { EmptyContent } from 'shared/v1-components/Table/EmptyContent';
import { Token, TokenImage, TokenLink } from 'shared/v1-components/Token';
import { Wallet } from 'shared/v1-components/Wallet';

export default function WalletsSwaps({ expanded }: { expanded?: boolean }) {
  const network = useActiveNetwork();
  const wallets = useTrackedWallets();
  const containerRef = useRef<HTMLDivElement>(null);

  const walletsAddresses = useMemo(
    () => wallets.map(w => w.address),
    [wallets],
  );

  const { data, isLoading } = useEnrichedSwaps({
    network,
    wallets: walletsAddresses,
  });

  const { data: pausedData, isPaused } = usePausedData(data, containerRef);

  return (
    <div className="mb-3 grow overflow-auto px-3" ref={containerRef}>
      <p className="mb-3 text-xs">Live Trades</p>
      <AccessShield
        mode="children"
        sizes={{ guest: true, free: false, vip: false, initial: false }}
      >
        {expanded ? (
          <Table
            chunkSize={5}
            columns={[
              {
                title: '',
                key: 'age',
                render: row => (
                  <button
                    onClick={() => openInScan('solana', { tx: row.txId })}
                  >
                    <ReadableDate
                      className="text-xs hover:underline"
                      suffix=""
                      value={row.relatedAt}
                    />
                  </button>
                ),
              },
              {
                title: 'Name',
                key: 'name',
                render: row => <Wallet address={row.wallet} mode="name" />,
              },
              {
                title: 'Token',
                key: 'token',
                render: row => (
                  <Token
                    address={row.asset}
                    logo={row.assetDetail?.image}
                    name={row.assetDetail?.name}
                    popup={true}
                    showAddress={!row.assetDetail?.name}
                    size="sm"
                    truncate={false}
                  />
                ),
              },
              {
                title: 'Amount',
                key: 'amount',
                width: 100,
                render: row => (
                  <div className="relative flex w-full items-center justify-center px-2">
                    <DirectionalNumber
                      className="text-xs"
                      direction={row.dir === 'sell' ? 'down' : 'up'}
                      format={{
                        decimalLength: 1,
                      }}
                      label="$"
                      showIcon={false}
                      showSign={false}
                      value={row.tokenAmount * row.price}
                    />
                    <div
                      className={clsx(
                        row.dir === 'sell'
                          ? 'to-v1-background-negative/20'
                          : 'to-v1-background-positive/20',
                        '-bottom-4 absolute h-8 w-full bg-gradient-to-b from-0% from-transparent to-100%',
                      )}
                    />
                  </div>
                ),
              },
              {
                title: 'MC',
                key: 'mc',
                render: row =>
                  row.assetDetail?.totalSupply && (
                    <ReadableNumber
                      className="text-xs"
                      format={{
                        decimalLength: 2,
                      }}
                      label="$"
                      value={row.price * Number(row.assetDetail.totalSupply)}
                    />
                  ),
              },
            ]}
            dataSource={pausedData}
            isPaused={isPaused}
            loading={isLoading}
            rowClassName="relative text-xs"
            scrollable
            surface={1}
          />
        ) : (
          <div>
            {pausedData.length === 0 && <EmptyContent />}
            {pausedData.map(row => (
              <TokenLink
                address={row.asset}
                className="mb-3 flex items-center gap-2 rounded-xl bg-v1-surface-l1 p-3 text-xs"
                key={row.id}
              >
                <div className="size-8">
                  <TokenImage
                    name={row.assetDetail?.name}
                    size="sm"
                    src={row.assetDetail?.image}
                  />
                </div>
                <div className="grow">
                  <div className="mb-1 flex items-center gap-1">
                    <Wallet
                      address={row.wallet}
                      className="truncate"
                      mode="name"
                    />
                    <span
                      className={
                        row.dir === 'sell'
                          ? 'text-v1-content-negative'
                          : 'text-v1-content-positive'
                      }
                    >
                      {row.dir === 'sell' ? 'sold' : 'bought'}
                    </span>
                    <span
                      className="w-14 truncate"
                      title={row.assetDetail?.name}
                    >
                      {row.assetDetail?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-v1-content-primary/70">
                    <DirectionalNumber
                      className="text-xs"
                      direction={row.dir === 'sell' ? 'down' : 'up'}
                      format={{
                        decimalLength: 1,
                      }}
                      label="$"
                      showIcon={false}
                      showSign={false}
                      value={row.tokenAmount * row.price}
                    />
                    at
                    <ReadableNumber
                      className="text-xs"
                      format={{
                        decimalLength: 2,
                      }}
                      label="$"
                      value={row.price * Number(row.assetDetail?.totalSupply)}
                    />
                    MC
                    <button
                      className="ml-auto"
                      onClick={() => openInScan('solana', { tx: row.txId })}
                    >
                      <ReadableDate
                        className="text-xs hover:underline"
                        suffix=""
                        value={row.relatedAt}
                      />
                    </button>
                  </div>
                </div>
              </TokenLink>
            ))}
          </div>
        )}
      </AccessShield>
    </div>
  );
}
