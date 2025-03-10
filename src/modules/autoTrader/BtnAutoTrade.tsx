import { useNavigate } from 'react-router-dom';
import { useSupportedPairs } from 'api';
import { Button, type ButtonProps } from 'shared/v1-components/Button';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import useIsMobile from 'utils/useIsMobile';
import useTradeDrawer from './PageTrade/useTradeDrawer';

export const BtnAutoTrade: React.FC<{ slug?: string } & ButtonProps> = ({
  slug,
  ...buttonProps
}) => {
  const normSlug = slug === 'solana' ? 'wrapped-solana' : slug;
  const { data: supportedPairs, isLoading } = useSupportedPairs(normSlug);
  const isSupported = !!supportedPairs?.length;
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isLoggedIn = useIsLoggedIn();
  const [TradeDrawer, openTradeDrawer] = useTradeDrawer();

  return (
    <Button
      {...buttonProps}
      block
      variant={buttonProps.variant ?? 'outline'}
      loading={isLoading}
      disabled={!normSlug || !isSupported || !isLoggedIn}
      onClick={() =>
        isMobile
          ? navigate(`/auto-trader/${normSlug ?? ''}`)
          : openTradeDrawer({ slug: normSlug ?? '' })
      }
    >
      <div>
        {TradeDrawer}
        <div>Auto Trade</div>
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
