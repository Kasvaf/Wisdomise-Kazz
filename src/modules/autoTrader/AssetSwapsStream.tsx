import { delphinusGrpc } from 'api/grpc';
import type { Swap } from 'api/proto/delphinus';
import clsx from 'clsx';
import { useActiveNetwork } from 'modules/base/active-network';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { Wallet } from 'modules/discovery/DetailView/WhaleDetail/Wallet';
import { useMemo } from 'react';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableDate } from 'shared/ReadableDate';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Table } from 'shared/v1-components/Table';
import { uniqueBy } from 'utils/uniqueBy';

const AssetSwapsStream: React.FC<{ id?: string; className?: string }> = ({
  id,
  className,
}) => {
  const { symbol } = useUnifiedCoinDetails();
  const network = useActiveNetwork();
  const asset = symbol.contractAddress!;

  const enabled = !!network && !!asset;
  const { data: history, isLoading } = delphinusGrpc.useSwapsHistoryQuery(
    {
      network,
      asset,
    },
    { enabled },
  );

  const { data: recent } = delphinusGrpc.useSwapsStreamAllValues(
    {
      network,
      asset,
    },
    { enabled },
  );

  const data = useMemo(
    () =>
      uniqueBy(
        [...(recent?.map(x => x.swap) ?? []), ...(history?.swaps ?? [])]
          .filter((x): x is Swap => !!x)
          .sort((a, b) => +new Date(b.relatedAt) - +new Date(a.relatedAt)),
        x => x.id,
      ).slice(0, 20),
    [history, recent],
  );

  return (
    <div className={clsx(className)} id={id!}>
      <Table
        columns={[
          {
            title: 'Amount',
            key: 'amount',
            render: row => (
              <DirectionalNumber
                className="text-xs"
                direction={row.fromAsset === asset ? 'down' : 'up'}
                format={{
                  decimalLength: 1,
                }}
                label="$"
                showIcon={false}
                showSign={false}
                value={
                  +(row.fromAsset === asset ? row.fromAmount : row.toAmount)
                }
              />
            ),
          },
          {
            title: 'Price',
            key: 'price',
            render: row => (
              <ReadableNumber
                className="text-xs"
                label="$"
                value={
                  +(row.fromAsset === asset
                    ? row.fromAssetPrice!
                    : row.toAssetPrice!)
                }
              />
            ),
          },
          {
            title: 'Trader',
            key: 'trader',
            render: row => (
              <Wallet
                className="text-xs [&_img]:hidden"
                noLink
                wallet={{
                  address: row.wallet.replace(/^(\w{3}).*(\w{3})$/, '$1..$2'),
                  network: symbol.network!,
                }}
                whale={false}
              />
            ),
          },
          {
            title: 'Age',
            key: 'age',
            width: 30,
            render: row => (
              <ReadableDate
                className="text-xs"
                suffix=""
                value={row.relatedAt}
              />
            ),
          },
        ]}
        dataSource={data}
        loading={isLoading}
        scrollable
        surface={1}
      />
    </div>
  );
};

export default AssetSwapsStream;
