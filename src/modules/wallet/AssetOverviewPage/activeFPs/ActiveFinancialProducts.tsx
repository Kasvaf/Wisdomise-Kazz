import { useInvestorAssetStructuresQuery } from 'api';
import FinancialProductItem from './FinancialProductItem';

export const ActiveFinancialProducts = () => {
  const ias = useInvestorAssetStructuresQuery();
  const data = ias.data?.[0];
  return (
    <>
      {data?.financial_product_instances.map(fpi => (
        <FinancialProductItem fpi={fpi} key={fpi.key} />
      ))}
    </>
  );
};
