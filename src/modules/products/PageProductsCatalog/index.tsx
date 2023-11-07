import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useInvestorAssetStructuresQuery,
  useFinancialProductsQuery,
} from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import ProductCatalogCard from './ProductCatalogCard';

const PageProductsCatalog = () => {
  const { t } = useTranslation('products');
  const fps = useFinancialProductsQuery();
  const ias = useInvestorAssetStructuresQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageWrapper loading={fps.isLoading || ias.isLoading}>
      <div className="mt-2">
        <h1 className="mb-4 text-xl font-semibold text-white">
          {t('product-catalog.title')}
        </h1>
        <p className="mb-6 text-sm font-medium text-white/60">
          {t('product-catalog.description')}
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

export default PageProductsCatalog;
