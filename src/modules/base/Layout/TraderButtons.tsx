import { clsx } from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';
import { useIsLoggedIn } from '../auth/jwt-store';
import { IconQuests, IconTrades } from './ProfileMenu/ProfileMenuContent/icons';

const TraderButtons = () => {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();
  if (!isLoggedIn) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => navigate('/trader/positions')}
        size={isMobile ? 'md' : 'xs'}
        variant="ghost"
        className={clsx(
          isMobile ? '!px-4' : '!px-2',
          pathname.startsWith('/trader/positions') && '!text-[#00A3FF]',
        )}
        surface={isMobile ? 2 : 3}
      >
        <IconTrades />
        Trades
      </Button>

      <Button
        onClick={() => navigate('/trader/quests')}
        size={isMobile ? 'md' : 'xs'}
        variant="ghost"
        className={clsx(
          isMobile ? '!px-4' : '!px-2',
          pathname.startsWith('/trader/quests') && '!text-v1-content-notice',
        )}
        surface={isMobile ? 2 : 3}
      >
        <IconQuests />
        Earn & Win
      </Button>
    </div>
  );
};

export default TraderButtons;
