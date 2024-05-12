import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useInvestorAssetStructuresQuery,
  useFinancialProductsQuery,
} from 'api';
import { type FinancialProduct } from 'api/types/financialProduct';
import { trackClick } from 'config/segment';
import PageWrapper from 'modules/base/PageWrapper';
import PriceChange from 'shared/PriceChange';
import CoinsIcons from 'shared/CoinsIcons';
import ProductSubscriptionNotice from '../PageProductCatalogDetail/ProductSubscriptionNotice';
import useIsFPRunning from '../useIsFPRunning';
import ProductCard from './ProductCard';

const ProductCardTrade: React.FC<{ fp: FinancialProduct }> = ({ fp }) => {
  const { t } = useTranslation('products');
  const isRunning = useIsFPRunning(fp.key);

  return (
    <ProductCard
      isRunning={isRunning}
      risk={fp.profile.return_risk_ratio}
      type={t('product-detail.type.trade')}
      title={fp.title}
      icon={<CoinsIcons maxShow={3} coins={fp.config.assets} />}
      description={fp.description}
      to={`/investment/products-catalog/fp/${fp.key}`}
      onClick={trackClick('ai_driven_strategies_list', {
        strategy_name: fp.title,
      })}
      notice={<ProductSubscriptionNotice fp={fp} />}
    >
      <div className="text-left">
        <p className="text-xl font-normal">
          {Math.abs(Number(fp.profile.max_drawdown.replace('%', '')))} %
        </p>
        <p className="font-normal text-white/30">
          {t('product-detail.max-drawdown')}
        </p>
      </div>

      <div className="text-center">
        <PriceChange
          valueToFixed={false}
          value={Number(fp.profile.expected_yield.replace('%', ''))}
          className="!justify-center"
          textClassName="!text-xl font-normal"
        />
        <p className="font-normal text-white/30">
          {t('product-detail.expected-apy')}
        </p>
      </div>
    </ProductCard>
  );
};

const TabTrade: React.FC<{ type: 'WISDOMISE' | 'MINE' | 'ALL' }> = ({
  type,
}) => {
  const { t } = useTranslation('products');
  const fps = useFinancialProductsQuery({ type });
  const ias = useInvestorAssetStructuresQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

      <div className="grid grid-cols-1 gap-6 mobile:justify-center lg:grid-cols-2 xl:grid-cols-3">
        {fps?.data?.products
          ?.filter(fp => fp.is_active)
          ?.map(fp => <ProductCardTrade key={fp.key} fp={fp} />)}
      </div>

      {type === 'MINE' && !fps.data?.count && (
        <div className="text-white/60">
          {t('product-catalog.empty-message')}
        </div>
      )}
    </PageWrapper>
  );
};

export default TabTrade;
