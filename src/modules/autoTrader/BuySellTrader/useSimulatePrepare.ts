import type { SwapState } from 'modules/autoTrader/BuySellTrader/useSwapState';
import { type CreatePositionRequest, usePreparePositionQuery } from 'api';
import { useMarketSwapSimulate } from 'api/chains/simulate';
import { useActiveNetwork } from 'modules/base/active-network';
import { useAccountNativeBalance } from 'api/chains';

const MIN_GAS = {
  TON: 0.1,
  SOL: 0,
};

export const useSimulatePrepare = ({
  formState,
  createData,
}: {
  formState: SwapState;
  createData?: CreatePositionRequest;
}) => {
  const { from, base, quote, dir } = formState;

  const swapData = {
    pairSlug: (base.slug ?? '') + '/' + quote.slug,
    side: dir === 'buy' ? 'LONG' : 'SHORT',
    amount: from.amount,
    network: 'solana',
  } as const;

  const net = useActiveNetwork();
  const gasAbbr = net === 'the-open-network' ? 'TON' : 'SOL';
  const { data: nativeBalance } = useAccountNativeBalance();
  const { data: d1, isLoading: l1 } = usePreparePositionQuery(createData);
  const { data: d2, isLoading: l2 } = useMarketSwapSimulate(swapData);
  const data = createData ? d1 : d2;
  const isLoading = createData ? l1 : l2;

  const nativeAmount =
    (data && 'gas_fee' in data ? Number(data?.gas_fee) : 0) +
    (from.coinInfo?.abbreviation === gasAbbr ? +from.amount : 0);

  const remainingGas = Number(nativeBalance) - nativeAmount;
  const hasEnoughGas = remainingGas > MIN_GAS[gasAbbr];
  const impact = Number(data?.price_impact);

  return {
    ready: !(isLoading || !hasEnoughGas || impact > 0.05 || !!data?.error),
    isLoading,
    hasEnoughGas,
    impact,
    data,
  };
};
