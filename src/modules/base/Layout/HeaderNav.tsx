import { useHasFlag, useTraderPositionsQuery } from 'api';
import { clsx } from 'clsx';
import { useDiscoveryUrlParams } from 'modules/discovery/lib';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePageTour from 'shared/usePageTour';
import { Button } from 'shared/v1-components/Button';
import { useLocalStorage } from 'usehooks-ts';
import useIsMobile from 'utils/useIsMobile';
import { useIsLoggedIn } from '../auth/jwt-store';
import { IconTrades } from './ProfileMenu/ProfileMenuContent/icons';

const HeaderNav = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();
  const { data } = useTraderPositionsQuery({ isOpen: true });
  const openTrades =
    data?.positions.filter(x => x.deposit_status !== 'PENDING').length ?? 0;
  const params = useDiscoveryUrlParams();
  const hasFlag = useHasFlag();

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
      {isMobile && hasFlag('/discovery?positions') && (
        <Button
          className={clsx(
            isMobile && '!px-4',
            params.list === 'positions' && '!text-v1-content-brand',
            'id-tour-trades-btn',
          )}
          onClick={() => {
            navigate(
              `/positions?filter=${hasClosedTrades && !openTrades ? 'history' : ''}`,
            );
          }}
          size="md"
          surface={1}
          variant="ghost"
        >
          <IconTrades />
          Trades
          {openTrades > 0 && (
            <div
              className={clsx(
                'rounded-full bg-v1-background-negative text-white text-xxs',
                openTrades >= 10 ? 'size-2' : 'size-4',
              )}
            >
              {openTrades >= 10 ? '' : openTrades}
            </div>
          )}
        </Button>
      )}
    </div>
  );
};

export default HeaderNav;
