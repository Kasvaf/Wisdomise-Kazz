import { clsx } from 'clsx';
import { useInvestorAssetStructuresQuery } from 'api';
import { ReactComponent as WorkingCapitalIcon } from '../icons/workingCapital.svg';
import { ReactComponent as AvailableIcon } from '../icons/available.svg';
import { ReactComponent as BalanceIcon } from '../icons/balanceIcon.svg';
import { ReactComponent as DepositIcon } from '../icons/deposit.svg';
import { ReactComponent as PNLIcon } from '../icons/pnl.svg';
import AssetBindingsSection from './AssetBindingsSection';
import InfoCard from './InfoCard';
const PNLIconWhite = () => <PNLIcon className="text-white/80" />;
const PNLIconGreen = () => <PNLIcon className="text-[#40F19C]" />;

const Portfolio: React.FC<{ className?: string }> = ({ className }) => {
  const ias = useInvestorAssetStructuresQuery();
  const data = ias.data?.[0];

  return (
    <div
      className={clsx(
        'grid grid-cols-3 gap-6 mobile:flex mobile:flex-col mobile:gap-0',
        className,
      )}
    >
      <InfoCard
        diffMobileView
        icon={BalanceIcon}
        title="Balance"
        value={data?.total_equity || 0}
        className="mobile:mb-4"
      />

      <InfoCard
        diffMobileView
        icon={data?.pnl && data?.pnl < 0 ? PNLIconWhite : PNLIconGreen}
        title="P / L"
        subtitle="(Unrealized)"
        colorizeValue
        className="!hidden mobile:mb-4"
        value={data?.pnl || 0}
      />

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
        className="!hidden mobile:rounded-b-none mobile:!border-t-0"
      />

      <InfoCard
        diffMobileView
        title="Working Capital"
        subtitle="AUM"
        icon={WorkingCapitalIcon}
        value={data?.working_capital || 0}
        className="mobile:mb-4"
      />

      <AssetBindingsSection />
    </div>
  );
};

export default Portfolio;
