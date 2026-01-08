import { ActiveNetworkProvider } from 'modules/base/active-network';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { WRAPPED_SOLANA_SLUG } from 'services/chains/constants';
import { useHasFlag, useTokenPairsQuery } from 'services/rest';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { Button, type ButtonProps } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';
import useTraderDrawer from './BuySellTrader/useTraderDrawer';

export const BtnAutoTrade: React.FC<{ slug?: string } & ButtonProps> = ({
  slug,
  ...buttonProps
}) => {
  const normSlug = slug === 'solana' ? WRAPPED_SOLANA_SLUG : slug;
  const { data: supportedPairs, isLoading } = useTokenPairsQuery(normSlug);
  const isSupported = !!supportedPairs?.length;
  const isMobile = useIsMobile();
  const isLoggedIn = useIsLoggedIn();
  const [TraderDrawer, openTraderDrawer] = useTraderDrawer();
  const [ModalLogin, ensureAuthenticated] = useEnsureAuthenticated();

  const hasFlag = useHasFlag();
  if (!isMobile && !hasFlag('/desk-trader')) {
    return null;
  }

  const open = async () => {
    if (!(await ensureAuthenticated())) return;
    openTraderDrawer({ slug: normSlug ?? '' });
  };

  return (
    <Button
      {...buttonProps}
      block
      disabled={!normSlug || !isSupported}
      loading={isLoading}
      onClick={open}
      variant={buttonProps.variant ?? 'outline'}
    >
      <div>
        {isLoggedIn && isSupported && !isLoading && (
          <ActiveNetworkProvider base={normSlug} setOnLayout>
            {TraderDrawer}
          </ActiveNetworkProvider>
        )}

        <div>{hasFlag('/quick-swap') ? 'Buy & Sell' : 'Auto Trade'}</div>
        {!isSupported && !isLoading && (
          <div className="text-2xs">Not Supported</div>
        )}
      </div>
      {ModalLogin}
    </Button>
  );
};
