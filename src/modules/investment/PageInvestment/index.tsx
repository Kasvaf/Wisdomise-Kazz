import { useTranslation } from 'react-i18next';
import { useInvestorAssetStructuresQuery } from 'api';
import { trackClick } from 'config/segment';
import CardPageLink from 'shared/CardPageLink';
import PageWrapper from 'modules/base/PageWrapper';
import { ReactComponent as IconFP } from './icon-fp.svg';
import { ReactComponent as IconAO } from './icon-ao.svg';

const PageInvestment = () => {
  const { t } = useTranslation('base');
  const ias = useInvestorAssetStructuresQuery();
  const activeProduct =
    ias.data?.[0]?.financial_product_instances?.[0]?.financial_product.title;

  return (
    <PageWrapper>
      <div className="mb-6 mobile:text-center">
        <h1 className="mb-3 text-3xl mobile:text-2xl">
          {t('menu.investment.title')}
        </h1>
        <p className="text-base text-white/80 mobile:text-xs">
          {t('menu.investment.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-2 items-stretch gap-6 mobile:grid-cols-1">
        <CardPageLink
          to="/investment/assets"
          title={t('menu.asset-overview.title')}
          subtitle={t('menu.asset-overview.subtitle')}
          icon={<IconAO />}
          height={250}
          onClick={trackClick('asset_overview_menu')}
        />

        <CardPageLink
          to="/investment/products-catalog"
          title={t('menu.financial-products.title')}
          subtitle={t('menu.financial-products.subtitle')}
          icon={<IconFP />}
          height={250}
          onClick={trackClick('financial_products_menu')}
        >
          {activeProduct && (
            <>
              <div className="text-xs font-normal">
                {t('menu.financial-products.active-product')}
              </div>
              <div className="text-2xl font-medium mobile:text-xl">
                {activeProduct}
              </div>
            </>
          )}
        </CardPageLink>
      </div>
    </PageWrapper>
  );
};

export default PageInvestment;
