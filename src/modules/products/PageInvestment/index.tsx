import PageWrapper from 'modules/base/PageWrapper';
import CardPageLink from 'modules/shared/CardPageLink';
import { ReactComponent as IconFP } from './icon-fp.svg';
import { ReactComponent as IconAO } from './icon-ao.svg';

const PageInvestment = () => {
  return (
    <PageWrapper>
      <h1 className="mb-3 text-3xl">Investment</h1>
      <p className="mb-6 text-base text-white/80">
        Explore Auto Trader or DeFi Staking financial products
      </p>

      <div className="grid grid-cols-2 items-stretch gap-6 mobile:grid-cols-1">
        <CardPageLink
          to="/investment/assets"
          title="Asset Overview"
          subtitle="Monitor and manage your financial products."
          icon={<IconAO className="absolute right-0 top-0" />}
        />

        <CardPageLink
          to="/investment/products-catalog"
          title="Financial Products"
          subtitle="Explore different investment package opportunities"
          icon={<IconFP className="absolute right-0 top-0" />}
        >
          <div className="text-xs font-normal">Active Product</div>
          <div className="text-2xl font-medium">TM Strategy</div>
        </CardPageLink>
      </div>
    </PageWrapper>
  );
};

export default PageInvestment;
