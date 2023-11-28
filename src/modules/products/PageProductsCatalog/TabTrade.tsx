import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useInvestorAssetStructuresQuery,
  useFinancialProductsQuery,
} from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import PriceChange from 'modules/shared/PriceChange';
import ProductCard from './ProductCard';

const TabTrade = () => {
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
          .map(fp => (
            <ProductCard
              key={fp.key}
              fp={fp}
              to={`/app/products-catalog/${fp.key}`}
            >
              <div className="text-left">
                <p className="text-xl font-normal">
                  {Math.abs(Number(fp.profile.max_drawdown.replace('%', '')))} %
                </p>
                <p className="font-normal text-white/30">
                  {t('product-detail.max-drawdown')}
                </p>
              </div>

              <div className="text-right">
                <PriceChange
                  valueToFixed={false}
                  value={Number(fp.profile.expected_yield.replace('%', ''))}
                  className="!justify-end"
                  textClassName="!text-xl font-normal"
                />
                <p className="font-normal text-white/30">
                  {t('product-detail.expected-apy')}
                </p>
              </div>
            </ProductCard>
          ))}
      </div>
    </PageWrapper>
  );
};

export default TabTrade;
