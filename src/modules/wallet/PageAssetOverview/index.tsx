import { NavLink } from 'react-router-dom';
import { bxPlus } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useInvestorAssetStructuresQuery } from 'api';
import Icon from 'shared/Icon';
import PageWrapper from 'modules/base/PageWrapper';
import ActiveFinancialProducts from './ActiveFinancialProducts';
import Portfolio from './Portfolio';
import BoxIntro from './BoxIntro';

const PageAssetOverview = () => {
  const { t } = useTranslation('asset-overview');
  const ias = useInvestorAssetStructuresQuery();
  const data = ias.data?.[0];
  const hasFpi = Boolean(data?.financial_product_instances[0]);
  const hasPortfolio = Boolean(
    data?.total_equity ||
      data?.main_exchange_account?.quote_equity ||
      data?.net_deposit,
  );

  return (
    <PageWrapper loading={ias.isLoading}>
      {!hasFpi && <BoxIntro className="mb-10" />}

      {/* ================================================================== */}

      {hasPortfolio && (
        <>
          <div className="mb-4 mt-10">
            <h1 className="text-xl font-semibold text-white">
              {t('portfolio.title')}
            </h1>
            <p className="mb-6 hidden text-sm font-medium text-white/60">
              {t('portfolio.description')}
            </p>
          </div>
          <Portfolio className="mb-10" />
        </>
      )}

      {/* ================================================================== */}

      {(hasFpi || hasPortfolio) && (
        <>
          <h1 className="mb-4 text-xl font-semibold text-white">
            {t('products:list.title')}
          </h1>

          {hasFpi ? (
            <ActiveFinancialProducts />
          ) : (
            <NavLink
              to="/investment/products-catalog?tab=trade"
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-black/20 py-6"
            >
              <p className="flex items-center text-white/60">
                {t('products:list.add-new')}{' '}
                <Icon name={bxPlus} className="ml-2 text-success" />
              </p>
              <p className="mt-6 w-1/2 text-center text-xs text-white/40">
                {t('products:list.description')}
              </p>
            </NavLink>
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default PageAssetOverview;
