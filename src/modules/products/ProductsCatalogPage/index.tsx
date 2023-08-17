import { useEffect } from 'react';
import {
  useInvestorAssetStructuresQuery,
  useFinancialProductsQuery,
} from 'api';
import { PageWrapper } from 'modules/base/PageWrapper';
import { ProductCatalogCard } from './ProductCatalogCard';

const ProductsCatalog = () => {
  const fps = useFinancialProductsQuery();
  const ias = useInvestorAssetStructuresQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageWrapper loading={fps.isLoading || ias.isLoading}>
        <div className="mt-2">
          <h2 className="mb-4 text-xl font-semibold text-white">
            All Strategies
          </h2>
          <p className="mb-6 text-sm leading-5 text-white/60 ">
            AI-based trading strategies run automatically on your crypto wallet.
            <br />
            These are built with our comprehensive and sophisticated AI after
            running over 300 million unique experiments
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,_350px)] gap-6 mobile:justify-center">
          {fps?.data?.results
            .filter(fp => fp.is_active)
            .map(fp => <ProductCatalogCard fp={fp} key={fp.key} />)}
        </div>
      </PageWrapper>
    </>
  );
};

export default ProductsCatalog;
