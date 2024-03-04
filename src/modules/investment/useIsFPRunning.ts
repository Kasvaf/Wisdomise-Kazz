import { useMemo } from 'react';
import { useInvestorAssetStructuresQuery } from 'api';

const useIsFPRunning = (fpKey?: string) => {
  const ias = useInvestorAssetStructuresQuery();
  const fpi = ias.data?.[0]?.financial_product_instances;
  return useMemo(() => {
    return fpi?.some(fp => fp.financial_product.key === fpKey);
  }, [fpi, fpKey]);
};

export default useIsFPRunning;
