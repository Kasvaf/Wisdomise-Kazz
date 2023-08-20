import { NavLink } from 'react-router-dom';
import { useInvestorAssetStructuresQuery } from 'api';
import { PageWrapper } from 'modules/base/PageWrapper';
import AskAthena from 'modules/athena/AskAthena';
import { ActiveFinancialProducts } from './activeFPs/ActiveFinancialProducts';
import { ReactComponent as PlusIcon } from './icons/plus.svg';
import BoxIntro from './BoxIntro';
import InfoCards from './InfoCards';

const AssetOverview = () => {
  const ias = useInvestorAssetStructuresQuery();
  const hasFpi = !!ias.data?.[0]?.financial_product_instances[0];

  return (
    <PageWrapper loading={ias.isLoading}>
      <AskAthena className="mb-6" />
      {!hasFpi && <BoxIntro className="mb-10" />}

      {/* ================================================================== */}

      <div className="mb-4 mt-10">
        <h1 className="text-xl font-semibold text-white">
          Your Account Portfolio
        </h1>
        <p className="mb-6 hidden text-sm font-medium text-white/60">
          AI-based trading strategies run automatically on your crypto wallet.
          These are built with our comprehensive and sophisticated AI after
          running over 300 million unique experiments
        </p>
      </div>
      <InfoCards className="mb-10" />

      {/* ================================================================== */}

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
            bots that can automatically buy and sell cryptocurrencies based on
            advanced algorithms and patterns.
          </p>
        </NavLink>
      )}
    </PageWrapper>
  );
};

export default AssetOverview;
