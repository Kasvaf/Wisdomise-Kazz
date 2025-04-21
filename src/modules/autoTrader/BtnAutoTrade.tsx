import { useHasFlag, useSupportedPairs } from 'api';
import { useActiveWallet } from 'api/chains';
import { Button, type ButtonProps } from 'shared/v1-components/Button';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import useIsMobile from 'utils/useIsMobile';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import useTradeDrawer from './PageTrade/useTradeDrawer';
import useQuickTradeDrawer from './PageTrade/QuickTradeDrawer/useQuickTradeDrawer';

export const BtnAutoTrade: React.FC<{ slug?: string } & ButtonProps> = ({
  slug,
  ...buttonProps
}) => {
  const normSlug = slug === 'solana' ? 'wrapped-solana' : slug;
  const { data: supportedPairs, isLoading } = useSupportedPairs(normSlug);
  const isSupported = !!supportedPairs?.length;
  const isMobile = useIsMobile();
  const isLoggedIn = useIsLoggedIn();
  const [TradeDrawer, openTradeDrawer] = useTradeDrawer();
  const [QuickTradeDrawer, openQuickTradeDrawer] = useQuickTradeDrawer();
  const [ModalLogin, ensureAuthenticated] = useEnsureAuthenticated();
  const wallet = useActiveWallet();

  const hasFlag = useHasFlag();
  if (!isMobile && !hasFlag('/desk-trader')) {
    return null;
  }

  const open = async () => {
    if (!(await ensureAuthenticated())) return;
    if (!wallet.connected && !(await wallet.connect())) return;

    isMobile
      ? openQuickTradeDrawer({ slug: normSlug ?? '' })
      : openTradeDrawer({ slug: normSlug ?? '' });
  };

  return (
    <Button
      {...buttonProps}
      block
      variant={buttonProps.variant ?? 'outline'}
      loading={isLoading}
      disabled={!normSlug || !isSupported}
      onClick={open}
    >
      <div>
        {isLoggedIn && isSupported && !isLoading && (
          <ActiveNetworkProvider base={normSlug} setOnLayout>
            {TradeDrawer}
            {QuickTradeDrawer}
          </ActiveNetworkProvider>
        )}

        <div>Auto Trade</div>
        {!isSupported && !isLoading && (
          <div className="text-xxs">Not Supported</div>
        )}
      </div>
      {ModalLogin}
    </Button>
  );
};
