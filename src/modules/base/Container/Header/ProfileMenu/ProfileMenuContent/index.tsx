import { isMiniApp } from 'utils/version';
import { useAccountQuery } from 'api';
import { useTelegramProfile } from 'modules/base/mini-app/TelegramProvider';
import { RouterBaseName } from 'config/constants';
import BranchSelector from '../../BranchSelector';
import MenuItem from './MenuItem';
import BoxedIcon from './BoxedIcon';
import MenuItemLang from './MenuItemLang';
import MenuItemLogout from './MenuItemLogout';
import MenuItemSupport from './MenuItemSupport';
import MenuItemReferral from './MenuItemReferral';
import MenuItemSubscription from './MenuItemSubscription';
import { IconAccount, IconAlerts, IconQuests, IconTrades } from './icons';

const ProfileMenuContent: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { data: account } = useAccountQuery();
  const profile = useTelegramProfile();

  return (
    <div className={className}>
      <div className="mb-6 line-clamp-1 text-ellipsis text-center text-base font-semibold">
        {isMiniApp
          ? `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`
          : account?.email}
      </div>

      <div className="flex flex-col gap-2">
        <MenuItem to="/account/overview">
          <BoxedIcon icon={IconAccount} />
          My Account
        </MenuItem>

        <MenuItem to="/trader-positions">
          <BoxedIcon icon={IconTrades} />
          Trades
        </MenuItem>

        <MenuItem to="/trader-quests">
          <BoxedIcon icon={IconQuests} />
          Quest
        </MenuItem>

        {!isMiniApp && <MenuItemSubscription />}

        <MenuItem to="/coin-radar/alerts">
          <BoxedIcon icon={IconAlerts} />
          Alerts
        </MenuItem>

        <MenuItemReferral />

        <div className="my-2 border-t border-t-v1-surface-l4" />

        <MenuItemLang />
        <MenuItemSupport />
      </div>

      {!isMiniApp && (
        <div className="mt-6 flex items-center justify-stretch gap-2">
          <MenuItemLogout />
          {RouterBaseName && <BranchSelector />}
        </div>
      )}
    </div>
  );
};

export default ProfileMenuContent;
