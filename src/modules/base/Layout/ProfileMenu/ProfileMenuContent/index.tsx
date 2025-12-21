import { DOCS_ORIGIN, RouterBaseName } from 'config/constants';
import { RewardIcon, WsdmTokenIcon } from 'modules/account/PageAccount/icons';
import { useTelegramProfile } from 'modules/base/mini-app/TelegramProvider';
import { useAccountQuery } from 'services/rest';
import { isMiniApp } from 'utils/version';
import BranchSelector from '../../BranchSelector';
import BoxedIcon from './BoxedIcon';
import {
  IconAccount,
  IconAlerts,
  IconHelp,
  IconQuests,
  IconTrades,
} from './icons';
import MenuItem from './MenuItem';
import MenuItemLogout from './MenuItemLogout';
import MenuItemReferral from './MenuItemReferral';
import MenuItemSubscription from './MenuItemSubscription';

const ProfileMenuContent: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { data: account } = useAccountQuery();
  const profile = useTelegramProfile();

  return (
    <div className={className}>
      <div className="mb-6 ml-2 flex items-center justify-between gap-4 text-center font-semibold text-base">
        <div className="line-clamp-1 text-ellipsis">
          {isMiniApp
            ? `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`
            : account?.email}
        </div>
        {!isMiniApp && (
          <div className="flex shrink-0 items-center justify-stretch gap-2">
            <MenuItemLogout />
            {RouterBaseName && <BranchSelector />}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <MenuItem to="/account/overview">
          <BoxedIcon icon={IconAccount} />
          My Account
        </MenuItem>

        <MenuItem to="/positions">
          <BoxedIcon icon={IconTrades} />
          Trades
        </MenuItem>

        <MenuItem to="/trader/quests">
          <BoxedIcon icon={IconQuests} />
          Earn & Win
        </MenuItem>

        {!isMiniApp && <MenuItemSubscription />}
        {!isMiniApp && (
          <MenuItem to="/account/token">
            <BoxedIcon icon={WsdmTokenIcon} />
            WSDM Token
          </MenuItem>
        )}

        <MenuItem to="/account/alerts">
          <BoxedIcon icon={IconAlerts} />
          Alerts
        </MenuItem>

        <MenuItemReferral />

        <MenuItem to="/account/rewards">
          <BoxedIcon icon={RewardIcon} />
          Rewards
        </MenuItem>

        <MenuItem onClick={() => window.open(DOCS_ORIGIN, '_blank')}>
          <BoxedIcon icon={IconHelp} />
          Docs
        </MenuItem>

        {/* <MenuItemLang /> */}
        {/* <MenuItemSupport /> */}
      </div>
    </div>
  );
};

export default ProfileMenuContent;
