import { clsx } from 'clsx';
import * as numerable from 'numerable';

import { useInvestorAssetStructuresQuery } from 'api';
import { AssetBindingsSection } from './assetBindingsSection/AssetBindingsSection';
import { ReactComponent as WorkingCapitalIcon } from './icons/workingCapital.svg';
import { ReactComponent as AvailableIcon } from './icons/available.svg';
import { ReactComponent as BalanceIcon } from './icons/balanceIcon.svg';
import { ReactComponent as DepositIcon } from './icons/deposit.svg';
import { ReactComponent as PNLIcon } from './icons/pnl.svg';

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
  format = '0,0.00',
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
          {numerable.format(value, format, {
            rounding: 'floor',
          })}
          <span className="ml-1 text-xs text-white/40">BUSD</span>
        </p>
      </div>
    </div>
  );
};

const InfoCards: React.FC<{ className?: string }> = ({ className }) => {
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
    <div
      className={clsx(
        'grid grid-cols-3 gap-6 mobile:flex mobile:flex-col mobile:gap-0',
        className,
      )}
    >
      <InfoCard
        icon={BalanceIcon}
        title="Balance"
        value={data?.total_equity || 0}
        className="mobile:mb-4"
      />

      <InfoCard
        icon={PNLIconFn}
        title="P / L"
        colorizeValue
        className="hidden mobile:mb-4"
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
        className="hidden mobile:rounded-b-none mobile:!border-t-0"
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

export default InfoCards;
