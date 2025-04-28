import { useHasFlag, useSupportedPairs } from 'api';
import { Button, type ButtonProps } from 'shared/v1-components/Button';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import useIsMobile from 'utils/useIsMobile';
import { useActiveWallet } from 'api/chains';
import useQuickSwapDrawer from './useQuickSwapDrawer';

export const BtnQuickSwap: React.FC<{ slug?: string } & ButtonProps> = ({
  slug,
  ...buttonProps
}) => {
  const normSlug = slug === 'solana' ? 'wrapped-solana' : slug;
  const { data: supportedPairs, isLoading } = useSupportedPairs(normSlug);
  const isSupported = !!supportedPairs?.length;
  const isMobile = useIsMobile();
  const isLoggedIn = useIsLoggedIn();
  const [QuickSwapDrawer, openQuickSwapDrawer] = useQuickSwapDrawer();
  const wallet = useActiveWallet();

  const hasFlag = useHasFlag();
  if (!isMobile || !hasFlag('/mobile-swap')) {
    return null;
  }

  return (
    <Button
      {...buttonProps}
      block
      variant={buttonProps.variant ?? 'outline'}
      loading={isLoading}
      disabled={!normSlug || !isSupported || !isLoggedIn}
      onClick={async () => {
        if (wallet.connected || (await wallet.connect())) {
          openQuickSwapDrawer({ slug: normSlug ?? '' });
        }
      }}
    >
      <div>
        {isLoggedIn && isSupported && !isLoading && (
          <ActiveNetworkProvider base={normSlug} setOnLayout>
            {QuickSwapDrawer}
          </ActiveNetworkProvider>
        )}

        <div>Quick Swap</div>
        {isLoggedIn ? (
          !isSupported &&
          !isLoading && <div className="text-xxs">Not Supported</div>
        ) : (
          <div className="text-xxs">Requires LogIn</div>
        )}
      </div>
    </Button>
  );
};
