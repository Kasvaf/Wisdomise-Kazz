import { type FC } from 'react';
import { useNCoinDetails, useTokenInsight } from 'api/discovery';
import { NCoinTokenInsight } from 'modules/discovery/ListView/NetworkRadar/NCoinTokenInsight';

export const NCoinInsightWidget: FC<{ className?: string; slug: string }> = ({
  className,
  slug,
}) => {
  const nCoin = useNCoinDetails({ slug });
  const { data } = useTokenInsight({
    contractAddress: nCoin.data?.base_contract_address,
  });
  if (!nCoin.data) return null;
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
