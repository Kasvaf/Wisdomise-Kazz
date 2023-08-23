import { NavLink } from 'react-router-dom';
import { useInvestorAssetStructuresQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import AskAthena from 'modules/athena/AskAthena';
import { ReactComponent as PlusIcon } from './icons/plus.svg';
import ActiveFinancialProducts from './ActiveFinancialProducts';
import Portfolio from './Portfolio';
import BoxIntro from './BoxIntro';

const AssetOverview = () => {
  const ias = useInvestorAssetStructuresQuery();
  const data = ias.data?.[0];
  const hasFpi = Boolean(data?.financial_product_instances[0]);
  const hasDeposited = Boolean(data?.net_deposit);
  const hasMoney = Boolean(
    data?.total_equity || data?.main_exchange_account.quote_equity,
  );

  return (
    <PageWrapper loading={ias.isLoading}>
      <AskAthena className="mb-6" />
      {!(hasFpi && hasDeposited) && <BoxIntro className="mb-10" />}

      {/* ================================================================== */}

      {(hasMoney || hasDeposited) && (
        <>
          <div className="mb-4 mt-10">
            <h1 className="text-xl font-semibold text-white">
              Your Account Portfolio
            </h1>
            <p className="mb-6 hidden text-sm font-medium text-white/60">
              AI-based trading strategies run automatically on your crypto
              wallet. These are built with our comprehensive and sophisticated
              AI after running over 300 million unique experiments
            </p>
          </div>
          <Portfolio className="mb-10" />
        </>
      )}

      {/* ================================================================== */}

      {(hasFpi || hasMoney || hasDeposited) && (
        <>
          <h1 className="mb-4 text-xl font-semibold text-white">
            Your Active Financial Products
          </h1>

          {hasFpi ? (
            <ActiveFinancialProducts />
          ) : (
            <NavLink
              to="/app/products-catalog"
              className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-black/20 py-6"
            >
              <p className="flex items-center text-white/60">
                Add Strategy <PlusIcon className="ml-4 h-4 w-4" />
              </p>
              <p className="mt-6 w-1/2 text-center text-xs text-white/40">
                Maximize your profits with the help of AI-powered crypto trading
                bots that can automatically buy and sell cryptocurrencies based
                on advanced algorithms and patterns.
              </p>
            </NavLink>
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default AssetOverview;
