import { useInvestorAssetStructuresQuery } from 'api';
import FinancialProductItem from './FinancialProductItem';

export const ActiveFinancialProducts: React.FC<{ className?: string }> = ({
  className,
}) => {
  const ias = useInvestorAssetStructuresQuery();
  const data = ias.data?.[0];
  const fpis = data?.financial_product_instances ?? [];

  return (
    <div className={className}>
      {fpis.map((fpi, ind) => (
        <FinancialProductItem
          fpi={fpi}
          key={fpi.key}
          className={ind !== fpis.length - 1 ? 'mb-6' : undefined}
        />
      ))}
    </div>
  );
};
