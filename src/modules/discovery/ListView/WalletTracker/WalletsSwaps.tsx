import clsx from 'clsx';
import { useAssetEnrichedSwaps } from 'modules/autoTrader/AssetSwapsStream';
import { openInScan } from 'modules/autoTrader/PageTransactions/TransactionBox/components';
import { usePausedData } from 'modules/autoTrader/usePausedData';
import { useActiveNetwork } from 'modules/base/active-network';
import { useTrackedWallets } from 'modules/discovery/ListView/WalletTracker/useTrackedWallets';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableDate } from 'shared/ReadableDate';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Table } from 'shared/v1-components/Table';
import { shortenAddress } from 'utils/shortenAddress';

export default function WalletsSwaps() {
  const network = useActiveNetwork();
  const wallets = useTrackedWallets();

  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const { data, isLoading } = useAssetEnrichedSwaps({
    network,
    wallets: wallets.map(w => w.address),
  });

  const { data: pausedData, isPaused } = usePausedData(data, containerRef);

  return (
    <div className="mb-3 grow overflow-auto" ref={containerRef}>
      <Table
        columns={[
          {
            title: '',
            key: 'age',
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
          {
            title: 'Name',
            key: 'name',
            render: row => {
              const wallet = wallets.find(w => w.address === row.wallet);
              return <span>{wallet && `${wallet.emoji} ${wallet.name}`}</span>;
            },
          },
          {
            title: 'Token',
            key: 'token',
            render: row => (
              <button
                className="cursor-pointer hover:underline"
                onClick={() => navigate(`/token/solana/${row.tokenAddress}`)}
              >
                {shortenAddress(row.tokenAddress)}
              </button>
            ),
          },
          {
            title: 'Amount',
            key: 'amount',
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
            title: 'Price',
            key: 'price',
            render: row => (
              <ReadableNumber
                className="text-xs"
                format={{
                  decimalLength: 2,
                }}
                label="$"
                value={row.price}
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
    </div>
  );
}
