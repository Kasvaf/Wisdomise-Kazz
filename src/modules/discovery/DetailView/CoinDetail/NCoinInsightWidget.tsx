import { NCoinTokenInsight } from 'modules/discovery/ListView/NetworkRadar/NCoinTokenInsight';
import type { FC } from 'react';
import { useUnifiedCoinDetails } from './lib';

export const NCoinInsightWidget: FC<{
  className?: string;
}> = ({ className }) => {
  const { validatedData } = useUnifiedCoinDetails();

  return (
    <NCoinTokenInsight
      className={className}
      type="card"
      value={{
        boundleHolding: validatedData?.boundleHolding,
        devHolding: validatedData?.devHolding,
        insiderHolding: validatedData?.insiderHolding,
        numberOfHolders: validatedData?.numberOfHolders,
        snipersHolding: validatedData?.snipersHolding,
        top10Holding: validatedData?.top10Holding,
      }}
    />
  );
};
