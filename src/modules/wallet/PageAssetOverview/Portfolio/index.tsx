import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        title={t('asset-overview.portfolio.info.balance')}
        value={data?.total_equity || 0}
        className="mobile:mb-4"
        valueClassName="!text-2xl"
      />

      <InfoCard
        diffMobileView
        icon={data?.pnl && data?.pnl < 0 ? PNLIconWhite : PNLIconGreen}
        title={t('asset-overview.portfolio.info.PnL.title')}
        subtitle={t('asset-overview.portfolio.info.PnL.unrealized')}
        colorizeValue
        className="!hidden mobile:mb-4"
        value={data?.pnl || 0}
      />

      <InfoCard
        diffMobileView
        title={t('asset-overview.portfolio.info.available.title')}
        icon={AvailableIcon}
        subtitle={t('asset-overview.portfolio.info.available.subtitle')}
        value={data?.main_exchange_account.quote_equity || 0}
        className="mobile:mb-4"
      />

      <InfoCard
        diffMobileView
        title={t('asset-overview.portfolio.info.deposit.title')}
        subtitle={t('asset-overview.portfolio.info.deposit.subtitle')}
        icon={DepositIcon}
        value={data?.net_deposit || 0}
        className="!hidden mobile:rounded-b-none mobile:!border-t-0"
      />

      <InfoCard
        diffMobileView
        title={t('asset-overview.portfolio.info.working-capital.title')}
        subtitle={t('asset-overview.portfolio.info.working-capital.subtitle')}
        icon={WorkingCapitalIcon}
        value={data?.working_capital || 0}
        className="mobile:mb-4"
      />

      <AssetBindingsSection />
    </div>
  );
};

export default Portfolio;
