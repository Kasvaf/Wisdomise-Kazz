import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useInvestorAssetStructuresQuery,
  useFinancialProductsQuery,
} from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import PriceChange from 'modules/shared/PriceChange';
import CoinsIcons from 'modules/shared/CoinsIcons';
import { type FinancialProduct } from 'api/types/financialProduct';
import useIsFPRunning from '../useIsFPRunning';
import ProductCard from './ProductCard';

const ProductCardTrade: React.FC<{ fp: FinancialProduct }> = ({ fp }) => {
  const { t } = useTranslation('products');
  const isRunning =
    useIsFPRunning(fp.key) || fp.key === '770896b2-d682-484b-96fc-02c311732946';

  return (
    <ProductCard
      isRunning={isRunning}
      risk={fp.profile.return_risk_ratio}
      title={fp.title}
      icon={<CoinsIcons maxShow={3} coins={fp.config.assets} />}
      description={fp.description}
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
  );
};

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
          .map(fp => <ProductCardTrade key={fp.key} fp={fp} />)}
      </div>
    </PageWrapper>
  );
};

export default TabTrade;
