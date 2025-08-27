import { delphinusGrpc } from 'api/grpc';
import type { Swap } from 'api/proto/delphinus';
import { useSymbolInfo } from 'api/symbol';
import { bxTransfer } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { SolanaCoin } from 'modules/autoTrader/CoinSwapActivity';
import { openInScan } from 'modules/autoTrader/PageTransactions/TransactionBox/components';
import { useActiveNetwork } from 'modules/base/active-network';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/useUnifiedCoinDetails';
import { type RefObject, useEffect, useMemo, useRef, useState } from 'react';
import Icon from 'shared/Icon';
import Spin from 'shared/Spin';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';
import { timeAgo } from 'utils/date';
import { formatNumber } from 'utils/numbers';
import { uniqueBy } from 'utils/uniqueBy';
import useNow from 'utils/useNow';

const usePausedData = <V,>(
  dataSource: V[],
  hoverElementRef: RefObject<HTMLElement>,
) => {
  const [isPaused, setIsPaused] = useState(false);
  const [data, setData] = useState<V[]>(dataSource);

  useEffect(() => {
    const el = hoverElementRef.current;
    if (!el) return;

    const handleEnter = () => setIsPaused(true);
    const handleLeave = () => setIsPaused(false);

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [hoverElementRef]);

  useEffect(() => {
    if (!isPaused) {
      setData(dataSource);
    }
  }, [dataSource, isPaused]);

  return { data, isPaused };
};

const AssetSwapsStream: React.FC<{ slug: string }> = ({ slug }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMarketCap, setIsMarketCap] = useState(true);
  const { data: symbol } = useSymbolInfo(slug);
  const { data: coin } = useUnifiedCoinDetails({ slug });
  const totalSupply = coin?.marketData.total_supply ?? 0;

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

  const [copy, notif] = useShare('copy');

  const updatedData = useMemo(
    () =>
      uniqueBy(
        [...(recent?.map(x => x.swap) ?? []), ...(history?.swaps ?? [])]
          .filter((x): x is Swap => !!x)
          .sort((a, b) => +new Date(b.relatedAt) - +new Date(a.relatedAt)),
        x => x.id,
      ).slice(0, 20),
    [history, recent],
  );

  const { data: pausedData, isPaused } = usePausedData(
    updatedData,
    containerRef,
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
    <div
      className={clsx(
        '-mx-3 p-3 text-white/70 text-xs',
        isPaused && 'bg-v1-surface-l1',
      )}
      ref={containerRef}
    >
      <table className="w-full">
        <thead className="text-white/50 [&>th]:pb-2">
          <th className="text-left font-normal">Amount</th>
          <th className="flex items-center gap-2 text-left font-normal">
            {isMarketCap ? 'MC' : 'Price'}
            <Button
              fab
              onClick={() => setIsMarketCap(!isMarketCap)}
              size="3xs"
              variant="ghost"
            >
              <Icon className="[&>svg]:!size-4" name={bxTransfer} />
            </Button>
          </th>
          <th className="text-left font-normal">Trader</th>
          <th className="text-left font-normal">Age</th>
        </thead>
        <tbody>
          {pausedData?.map(row => {
            const dir = row.fromAsset === asset ? 'sell' : 'buy';
            const amount =
              row.fromAsset === asset ? row.toAmount : row.fromAmount;
            const price =
              row.fromAsset === asset ? row.fromAssetPrice : row.toAssetPrice;

            return (
              <tr className="[&>td]:pb-1" key={row.id}>
                <td
                  className={clsx(
                    dir === 'sell'
                      ? 'text-v1-content-negative'
                      : 'text-v1-content-positive',
                    'flex items-center gap-1',
                  )}
                >
                  <SolanaCoin />
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
                      formatNumber(+price * (isMarketCap ? totalSupply : 1), {
                        compactInteger: true,
                        decimalLength: 2,
                        separateByComma: false,
                        minifyDecimalRepeats: true,
                      })
                    : ''}
                </td>
                <td
                  className="cursor-pointer hover:underline"
                  onClick={() => copy(row.wallet)}
                >
                  {row.wallet.slice(-3)}
                </td>
                <td
                  className="cursor-pointer text-v1-content-secondary hover:underline"
                  onClick={() => openInScan('solana', { tx: row.txId })}
                >
                  {timeAgo(new Date(row.relatedAt), new Date(now))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {notif}
    </div>
  );
};

export default AssetSwapsStream;
