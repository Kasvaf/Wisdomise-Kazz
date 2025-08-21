import { delphinusGrpc } from 'api/grpc';
import type { Swap } from 'api/proto/delphinus';
import { useSymbolInfo } from 'api/symbol';
import { useActiveNetwork } from 'modules/base/active-network';
import { useMemo } from 'react';
import Spin from 'shared/Spin';
import { timeAgo } from 'utils/date';
import { formatNumber } from 'utils/numbers';
import { uniqueBy } from 'utils/uniqueBy';
import useNow from 'utils/useNow';

const AssetSwapsStream: React.FC<{ slug: string }> = ({ slug }) => {
  const { data: symbol } = useSymbolInfo(slug);
  const network = useActiveNetwork();
  const asset = symbol?.networks.find(
    x => x.network.slug === network,
  )?.contract_address;

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

  const now = useNow();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-1 py-6">
        <Spin /> Loading...
      </div>
    );
  }

  return (
    <div>
      <table className="w-full">
        <thead className="text-white/50">
          <th className="text-left font-normal">Amount</th>
          <th className="text-left font-normal">Price</th>
          <th className="text-left font-normal">Trader</th>
          <th className="text-left font-normal">Age</th>
        </thead>
        <tbody>
          {data?.map(row => {
            const dir = row.fromAsset === asset ? 'sell' : 'buy';
            const amount =
              row.fromAsset === asset ? row.fromAmount : row.toAmount;
            const price =
              row.fromAsset === asset ? row.fromAssetPrice : row.toAssetPrice;

            return (
              <tr key={row.id}>
                <td
                  className={
                    dir === 'sell'
                      ? 'text-v1-content-negative'
                      : 'text-v1-content-positive'
                  }
                >
                  {formatNumber(+amount, {
                    compactInteger: true,
                    decimalLength: 3,
                    separateByComma: false,
                    minifyDecimalRepeats: true,
                  })}
                </td>
                <td>
                  {price
                    ? '$ ' +
                      formatNumber(+price, {
                        compactInteger: true,
                        decimalLength: 2,
                        separateByComma: false,
                        minifyDecimalRepeats: true,
                      })
                    : ''}
                </td>
                <td>{row.wallet.replace(/^(\w{3}).*(\w{3})$/, '$1..$2')}</td>
                <td>{timeAgo(new Date(row.relatedAt), new Date(now))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AssetSwapsStream;
