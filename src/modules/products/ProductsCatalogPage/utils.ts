import { type InvestorAssetStructures } from 'api/types/investorAssetStructure';

export const isFPRunning = (ias?: InvestorAssetStructures, fpKey?: string) => {
  const fpis = ias?.[0]?.financial_product_instances;
  return fpis?.[0]?.financial_product.key === fpKey;
};
