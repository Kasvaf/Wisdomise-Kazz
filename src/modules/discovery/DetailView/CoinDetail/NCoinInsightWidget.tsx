import { useTokenInsight } from 'api/discovery';
import { NCoinTokenInsight } from 'modules/discovery/ListView/NetworkRadar/NCoinTokenInsight';
import type { FC } from 'react';
import { useUnifiedCoinDetails } from './lib';

export const NCoinInsightWidget: FC<{
  className?: string;
}> = ({ className }) => {
  const { symbol } = useUnifiedCoinDetails();
  const { data } = useTokenInsight({
    contractAddress: symbol.contractAddress ?? undefined,
  });
  return (
    <NCoinTokenInsight
      className={className}
      type="card"
      value={{
        boundleHolding: data?.bundlers_holding_percentage,
        devHolding: data?.dev_holding_percentage,
        insiderHolding: data?.insiders_holding_percentage,
        numberOfHolders: data?.total_holders,
        snipersHolding: data?.insiders_holding_percentage,
        top10Holding: data?.top_10_holders_holding_percentage,
      }}
    />
  );
};
