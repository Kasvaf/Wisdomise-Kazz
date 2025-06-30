import dayjs from 'dayjs';
import { useHistoricalSwaps } from 'api';
import { useSymbolInfo } from 'api/symbol';
import { useActiveNetwork } from 'modules/base/active-network';
import useNow from 'utils/useNow';
import { roundSensible } from 'utils/numbers';
import { delphinusGrpc } from 'api/grpc';
import { uniqueBy } from 'utils/uniqueBy';

const Trades: React.FC<{ slug: string }> = ({ slug }) => {
  const { data: symbol } = useSymbolInfo(slug);
  const network = useActiveNetwork();
  const asset = symbol?.networks.find(x => x.network.slug === network)
    ?.contract_address;
  const { data: history } = useHistoricalSwaps({
    network,
    asset,
  });

  const { data: recent } = delphinusGrpc.useSwapsStreamAllValues({
    network,
    asset,
  });
  const data = uniqueBy(
    [...(recent ?? []), ...(history ?? [])].sort(
      (a, b) => +new Date(b.relatedAt) - +new Date(a.relatedAt),
    ),
    x => x.id,
  ).slice(0, 20);

  const now = useNow();

  return (
    <div>
      <table className="w-full">
        <thead className="text-white/50">
          <td>Amount</td>
          <td>Price</td>
          <td>Age</td>
        </thead>
        <tbody>
          {data?.map(row => {
            const dir = row.fromAsset === asset ? 'sell' : 'buy';
            const amount =
              +(row.fromAsset === asset ? row.fromAmount : row.toAmount) *
              +(row.price ?? 0);
            return (
              <tr key={row.id}>
                <td
                  className={
                    dir === 'sell'
                      ? 'text-v1-content-negative'
                      : 'text-v1-content-positive'
                  }
                >
                  $ {roundSensible(amount)}
                </td>
                <td>{roundSensible(row.price)}</td>
                <td>{dayjs(+new Date(row.relatedAt)).from(now)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Trades;
