import * as numerable from 'numerable';
import { useTranslation } from 'react-i18next';
import { useInvestmentProtocolsQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import PriceChange from 'modules/shared/PriceChange';
import { type InvestmentProtocol } from 'api/types/financialProduct';
import ProductCard from './ProductCard';

const ProductCardStake: React.FC<{ ip: InvestmentProtocol }> = ({ ip }) => {
  const { t } = useTranslation('products');

  return (
    <ProductCard
      risk={ip.risk}
      type={t('product-detail.type.stake')}
      title={ip.name}
      icon={<img src={ip.logo_address} className="h-10 w-10 rounded-full" />}
      description={ip.description}
      to={`/app/staking/protocol/${ip.key}`}
    >
      <div className="text-left">
        <p className="text-xl font-normal">
          ${numerable.format(ip.tvl_usd, '0,0')}
        </p>
        <p className="font-normal text-white/30">{t('product-detail.tvl')}</p>
      </div>

      <div className="text-right">
        <PriceChange
          valueToFixed
          value={ip.max_apy}
          className="!justify-end"
          textClassName="!text-xl font-normal"
        />
        <p className="font-normal text-white/30">
          {t('product-detail.max-apy')}
        </p>
      </div>
    </ProductCard>
  );
};

const TabStake = () => {
  const { t } = useTranslation('products');
  const ips = useInvestmentProtocolsQuery();

  return (
    <PageWrapper loading={ips.isLoading}>
      <div className="mt-2">
        <h1 className="mb-4 text-xl font-semibold text-white">
          {t('product-catalog.stake.title')}
        </h1>
        <p className="mb-6 text-sm font-medium text-white/60">
          {t('product-catalog.stake.description')}
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(_350px,1fr))] gap-6 mobile:justify-center">
        {ips?.data?.map(ip => <ProductCardStake key={ip.key} ip={ip} />)}
      </div>
    </PageWrapper>
  );
};

export default TabStake;
