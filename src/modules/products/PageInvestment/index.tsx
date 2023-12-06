import PageWrapper from 'modules/base/PageWrapper';
import CardPageLink from 'modules/shared/CardPageLink';
import { ReactComponent as IconFP } from './icon-fp.svg';
import { ReactComponent as IconAO } from './icon-ao.svg';

const PageInvestment = () => {
  return (
    <PageWrapper>
      <div className="mb-6 mobile:text-center">
        <h1 className="mb-3 text-3xl mobile:text-2xl">Investment</h1>
        <p className="text-base text-white/80 mobile:text-xs">
          Explore Auto Trader or DeFi Staking financial products
        </p>
      </div>

      <div className="grid grid-cols-2 items-stretch gap-6 mobile:grid-cols-1">
        <CardPageLink
          to="/investment/assets"
          title="Asset Overview"
          subtitle="Monitor and manage your financial products."
          icon={<IconAO />}
          height={250}
        />

        <CardPageLink
          to="/investment/products-catalog"
          title="Financial Products"
          subtitle="Explore different investment package opportunities"
          icon={<IconFP />}
          height={250}
        >
          <div className="text-xs font-normal">Active Product</div>
          <div className="text-2xl font-medium">TM Strategy</div>
        </CardPageLink>
      </div>
    </PageWrapper>
  );
};

export default PageInvestment;
