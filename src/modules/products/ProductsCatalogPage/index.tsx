import { useEffect } from 'react';
import {
  useInvestorAssetStructuresQuery,
  useFinancialProductsQuery,
} from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import ProductCatalogCard from './ProductCatalogCard';

const ProductsCatalog = () => {
  const fps = useFinancialProductsQuery();
  const ias = useInvestorAssetStructuresQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageWrapper loading={fps.isLoading || ias.isLoading}>
      <div className="mt-2">
        <h1 className="mb-4 text-xl font-semibold text-white">
          AI-driven Strategies
        </h1>
        <p className="mb-6 text-sm font-medium text-white/60">
          Your investment in any of the available strategies will be liquid,
          meaning that your assets will not be locked up and can be released
          anytime you want. The expected ROI, maximum drawdown, and number of
          trades presented for different strategies are indicative and in no way
          a guarantee or confirmation of these metrics. In the end, investment
          in financial markets will always come with its own risks and
          volatility, and our state-of-the-art AI models can only mitigate them
          to some extent. Enjoy building up your wealth with our proprietary AI!
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(_350px,1fr))] gap-6 mobile:justify-center">
        {fps?.data?.results
          .filter(fp => fp.is_active)
          .map(fp => <ProductCatalogCard fp={fp} key={fp.key} />)}
      </div>
    </PageWrapper>
  );
};

export default ProductsCatalog;
