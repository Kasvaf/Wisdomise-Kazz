import { type InvestorAssetStructures } from 'api/types/investorAssetStructure';

const isFPRunning = (ias?: InvestorAssetStructures, fpKey?: string) => {
  return ias?.[0]?.financial_product_instances.some(
    fp => fp.financial_product.key === fpKey,
  );
};

export default isFPRunning;
