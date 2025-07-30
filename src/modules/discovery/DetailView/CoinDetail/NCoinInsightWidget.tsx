import { type FC } from 'react';
import { useTokenInsight } from 'api/discovery';
import { NCoinTokenInsight } from 'modules/discovery/ListView/NetworkRadar/NCoinTokenInsight';
import { useUnifiedCoinDetails } from './useUnifiedCoinDetails';

export const NCoinInsightWidget: FC<{ className?: string; slug: string }> = ({
  className,
  slug,
}) => {
  const { data: coin } = useUnifiedCoinDetails({ slug });
  const contractAddress = coin?.networks?.[0]?.contract_address;
  const { data } = useTokenInsight({
    contractAddress,
  });
  if (!contractAddress) return null;
  return (
    <NCoinTokenInsight
      value={{
        boundleHolding: data?.bundlers_holding_percentage,
        devHolding: data?.dev_holding_percentage,
        insiderHolding: data?.insiders_holding_percentage,
        numberOfHolders: data?.total_holders,
        snipersHolding: data?.insiders_holding_percentage,
        top10Holding: data?.top_10_holders_holding_percentage,
      }}
      className={className}
      type="card"
    />
  );
};
