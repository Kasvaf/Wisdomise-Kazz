import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useInvestorAssetStructuresQuery,
  useFinancialProductsQuery,
} from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import ProductCard from './ProductCard';

const TabTrade: React.FC<{ type: 'WISDOMISE' | 'MINE' | 'ALL' }> = ({
  type,
}) => {
  const { t } = useTranslation('products');
  const fps = useFinancialProductsQuery({ type });
  const ias = useInvestorAssetStructuresQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activeFps = fps?.data?.products?.filter(
    fp => fp.is_active && fp.config.assets.length > 0,
  );

  return (
    <PageWrapper loading={fps.isLoading || ias.isLoading}>
      {type !== 'MINE' && (
        <div className="mt-2">
          <h1 className="mb-4 text-xl font-semibold text-white">
            {t('product-catalog.trade.title')}
          </h1>
          <p className="mb-6 text-sm font-medium text-white/60">
            {t('product-catalog.trade.description')}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 mobile:justify-center lg:grid-cols-2 xl:grid-cols-4">
        {activeFps?.map(fp => <ProductCard key={fp.key} fp={fp} />)}
      </div>

      {type === 'MINE' && !activeFps?.length && (
        <div className="text-white/60">
          {t('product-catalog.empty-message')}
        </div>
      )}
    </PageWrapper>
  );
};

export default TabTrade;
