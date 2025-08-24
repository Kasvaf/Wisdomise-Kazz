import { useTokenInsight } from 'api/discovery';
import { NCoinTokenInsight } from 'modules/discovery/ListView/NetworkRadar/NCoinTokenInsight';
import type { FC } from 'react';
import type { ComplexSlug } from './lib';

export const NCoinInsightWidget: FC<{
  className?: string;
  slug: ComplexSlug;
}> = ({ className, slug }) => {
  const { data } = useTokenInsight({
    contractAddress: slug.contractAddress,
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
