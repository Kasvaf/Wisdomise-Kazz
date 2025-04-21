import { bxsTrophy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';
import { useIsLoggedIn } from '../auth/jwt-store';
import { IconTrades } from './ProfileMenu/ProfileMenuContent/icons';

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
        onClick={() => navigate('/trader/quests/tournaments')}
        size={isMobile ? 'md' : 'xs'}
        variant="ghost"
        className={clsx(
          isMobile ? '!px-4' : '!px-2',
          pathname.startsWith('/trader/quests/tournaments') &&
            '!text-v1-content-notice',
        )}
        surface={isMobile ? 2 : 3}
      >
        <Icon name={bxsTrophy} className="text-v1-background-notice" />
        Tournaments
      </Button>
    </div>
  );
};

export default TraderButtons;
