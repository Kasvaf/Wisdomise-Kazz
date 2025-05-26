import { clsx } from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Button } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';
import { useTraderPositionsQuery } from 'api';
import usePageTour from 'shared/usePageTour';
import { useIsLoggedIn } from '../auth/jwt-store';
import { IconQuests, IconTrades } from './ProfileMenu/ProfileMenuContent/icons';

const TraderButtons = () => {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();
  const { data } = useTraderPositionsQuery({ isOpen: true });
  const openTrades =
    data?.positions.filter(x => x.deposit_status !== 'PENDING').length ?? 0;

  const [maxOpenTrades, setMaxOpenTrade] = useLocalStorage(
    'max-open-trades',
    0,
  );
  useEffect(() => {
    setMaxOpenTrade(x => Math.max(x, openTrades));
  }, [openTrades, setMaxOpenTrade]);

  const hasClosedTrades = openTrades < maxOpenTrades;
  usePageTour({
    key: 'closed-trades',
    enabled: hasClosedTrades,
    delay: 500,
    steps: [
      {
        selector: '.id-tour-trades-btn',
        content: (
          <>
            <div className="mb-2 font-semibold">
              Track your performance here.
            </div>
            <div>
              Check the Trade History tab to review your open and closed
              position.
            </div>
          </>
        ),
      },
    ],
  });

  if (!isLoggedIn) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() =>
          navigate(
            '/trader/positions' +
              (hasClosedTrades && !openTrades ? '?filter=history' : ''),
          )
        }
        size={isMobile ? 'md' : 'xs'}
        variant="ghost"
        className={clsx(
          isMobile ? '!px-4' : '!px-2',
          pathname.startsWith('/trader/positions') && '!text-[#00A3FF]',
          'id-tour-trades-btn',
        )}
        surface={isMobile ? 2 : 3}
      >
        <IconTrades />
        Trades
        {openTrades > 0 && (
          <div
            className={clsx(
              'rounded-full bg-v1-background-negative text-xxs text-white',
              openTrades >= 10 ? 'size-2' : 'size-4',
            )}
          >
            {openTrades >= 10 ? '' : openTrades}
          </div>
        )}
      </Button>

      <Button
        onClick={() => navigate('/trader/quests')}
        size={isMobile ? 'md' : 'xs'}
        variant="ghost"
        className={clsx(
          isMobile ? '!px-4' : '!px-2',
          '!text-v1-content-notice',
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
