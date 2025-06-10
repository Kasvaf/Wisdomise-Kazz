import { type FC } from 'react';
import { useNCoinDetails } from 'api/discovery';
import { NCoinTokenInsight } from 'modules/discovery/ListView/NetworkRadar/NCoinTokenInsight';

export const NCoinInsightWidget: FC<{ className?: string; slug: string }> = ({
  className,
  slug,
}) => {
  const nCoin = useNCoinDetails({ slug });
  if (!nCoin.data) return null;
  return (
    <NCoinTokenInsight
      contractAddress={nCoin.data.base_contract_address}
      className={className}
      type="card"
    />
  );
};
