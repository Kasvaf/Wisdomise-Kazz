import { useTranslation } from 'react-i18next';
import { useInvestorAssetStructuresQuery } from 'api';
import { trackClick } from 'config/segment';
import PageWrapper from 'modules/base/PageWrapper';
import { PageCard } from 'shared/PageCard';
import { PageTitle } from 'shared/PageTitle';
import { ReactComponent as IconFP } from './icon-fp.svg';
import { ReactComponent as IconAO } from './icon-ao.svg';
import { ReactComponent as InvestmentIcon } from './investment-empty.svg';

const PageInvestment = () => {
  const { t } = useTranslation('base');
  const ias = useInvestorAssetStructuresQuery();
  const activeProduct =
    ias.data?.[0]?.financial_product_instances?.[0]?.financial_product.title;

  return (
    <PageWrapper>
      <PageTitle
        icon={InvestmentIcon}
        title={t('menu.investment.title')}
        description={t('menu.investment.subtitle')}
        className="mb-10"
      />

      <div className="grid grid-cols-2 items-stretch gap-6 mobile:grid-cols-1">
        <PageCard
          to="/marketplace/products-catalog"
          title={t('menu.financial-products.title')}
          description={t('menu.financial-products.subtitle')}
          icon={IconFP}
          onClick={trackClick('financial_products_menu')}
          badge={
            activeProduct && (
              <>
                <label className="font-light opacity-70">
                  {t('menu.financial-products.active-product')}:
                </label>
                {activeProduct}
              </>
            )
          }
        />

        <PageCard
          to="/marketplace/assets"
          title={t('menu.builder.title')}
          description={t('menu.builder.subtitle')}
          icon={IconAO}
          onClick={trackClick('asset_overview_menu')}
        />
      </div>
    </PageWrapper>
  );
};

export default PageInvestment;
