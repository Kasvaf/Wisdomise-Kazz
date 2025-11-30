import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import BtnLogin from 'modules/base/Layout/ProfileMenu/BtnLogin';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { Badge } from 'shared/v1-components/Badge';
import { Button } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';
import { isDebugMode, isMiniApp } from 'utils/version';
import BtnTelegramProfile from './BtnTelegramProfile';
import ProfileMenuContent from './ProfileMenuContent';
import { ReactComponent as UserIcon } from './user.svg';

const DebugBadge = () =>
  isDebugMode ? <Badge color="negative" dot variant="solid" /> : null;

const ProfileMenu: React.FC<{ className?: string }> = ({ className }) => {
  const isLoggedIn = useIsLoggedIn();
  const isMobile = useIsMobile();

  return isLoggedIn ? (
    <ClickableTooltip
      chevron={false}
      className={className}
      title={<ProfileMenuContent />}
      tooltipPlacement="bottomLeft"
    >
      {isMiniApp ? (
        <BtnTelegramProfile />
      ) : (
        <Button
          className={isMobile ? 'w-md' : 'w-xs'}
          size={isMobile ? 'sm' : 'xs'}
          surface={1}
          variant="ghost"
        >
          <UserIcon className="size-4 shrink-0" />
          <DebugBadge />
        </Button>
      )}
    </ClickableTooltip>
  ) : (
    <BtnLogin />
  );
};

export default ProfileMenu;
