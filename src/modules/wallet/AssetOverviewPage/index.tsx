import { clsx } from 'clsx';
import type React from 'react';
import * as numerable from 'numerable';
import { NavLink } from 'react-router-dom';
import { useInvestorAssetStructuresQuery } from 'api';
import { PageWrapper } from 'modules/base/PageWrapper';
import { ActiveFinancialProducts } from './activeFPs/ActiveFinancialProducts';
import { AssetBindingsSection } from './assetBindingsSection/AssetBindingsSection';
import { ReactComponent as WorkingCapitalIcon } from './icons/workingCapital.svg';
import { ReactComponent as AvailableIcon } from './icons/available.svg';
import { ReactComponent as BalanceIcon } from './icons/balanceIcon.svg';
import { ReactComponent as DepositIcon } from './icons/deposit.svg';
import { ReactComponent as PlusIcon } from './icons/plus.svg';
import { ReactComponent as PNLIcon } from './icons/pnl.svg';

const AssetOverview = () => {
  const ias = useInvestorAssetStructuresQuery();
  const data = ias.data?.[0];

  const PNLIconFn = () => (
    <PNLIcon
      className={clsx(
        data?.pnl && data?.pnl < 0 ? 'text-white/80' : 'text-[#40F19C]',
      )}
    />
  );

  return (
    <PageWrapper loading={ias.isLoading}>
      <div className="mt-2">
        <h1 className="mb-4 text-xl font-semibold text-white">
          Your Account Portfolio
        </h1>
        <p className="mb-6 hidden text-sm font-medium text-white/60">
          AI-based trading strategies run automatically on your crypto wallet.
          These are built with our comprehensive and sophisticated AI after
          running over 300 million unique experiments
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mobile:flex mobile:flex-col mobile:gap-0">
        <InfoCard
          icon={BalanceIcon}
          title="Balance"
          value={data?.total_equity || 0}
          className="mobile:mb-4"
        />

        {/* <InfoCard
          icon={PNLIconFn}
          format="0,0.00"
          title="P / L"
          colorizeValue
          className="mobile:mb-4"
          value={data?.pnl || 0}
        /> */}
        <InfoCard
          diffMobileView
          title="Available"
          icon={AvailableIcon}
          subtitle="Withdrawable"
          value={data?.main_exchange_account.quote_equity || 0}
          className="mobile:mb-4"
        />

        <InfoCard
          diffMobileView
          title="Deposit"
          subtitle="Amount"
          icon={DepositIcon}
          value={data?.net_deposit || 0}
          className="mobile:rounded-b-none mobile:!border-t-0"
        />

        <AssetBindingsSection />

        <InfoCard
          diffMobileView
          title="Working Capital"
          subtitle="AUM"
          icon={WorkingCapitalIcon}
          value={data?.working_capital || 0}
          className="mobile:mb-4 mobile:rounded-t-none"
        />
      </div>

      <h1 className="my-6 text-xl font-semibold text-white">
        Your Active Financial Products
      </h1>

      <ActiveFinancialProducts />

      {data?.financial_product_instances.length === 0 && (
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

const InfoCard: React.FC<{
  title: string;
  value: number;
  icon: React.FC;
  format?: string;
  subtitle?: string;
  className?: string;
  diffMobileView?: boolean;
  colorizeValue?: boolean;
}> = ({
  title,
  value,
  format,
  subtitle,
  icon: Icon,
  colorizeValue = false,
  className,
  diffMobileView,
}) => {
  return (
    <div
      className={clsx(
        'rounded-3xl bg-white/5 p-6',
        className,
        diffMobileView &&
          'mobile:flex mobile:flex-row-reverse mobile:border-t mobile:border-white/5',
      )}
    >
      <div className="mb-2 flex justify-end mobile:mb-0">
        <Icon />
      </div>
      <div className={clsx(diffMobileView && 'mobile:grow')}>
        <p className="text-sm leading-none text-white/60">
          {title} <span className="text-xxs text-white/40">{subtitle}</span>
        </p>

        <p
          className={clsx(
            'mt-4 text-xl font-semibold leading-none text-white',
            colorizeValue && value >= 0 && '!text-[#40F19C]',
            title === 'Balance' && '!text-2xl',
          )}
        >
          {numerable.format(value, format || '0,0.00', {
            rounding: 'floor',
          })}
          <span className="ml-1 text-xs text-white/40">BUSD</span>
        </p>
      </div>
    </div>
  );
};

export default AssetOverview;
