import { useNavigate } from 'react-router-dom';
import { useSupportedPairs } from 'api';
import { Button, type ButtonProps } from 'shared/v1-components/Button';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import useIsMobile from 'utils/useIsMobile';

export const BtnAutoTrade: React.FC<{ slug?: string } & ButtonProps> = ({
  slug,
  ...buttonProps
}) => {
  const { data: supportedPairs, isLoading } = useSupportedPairs(slug);
  const isSupported = !!supportedPairs?.length;
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isLoggedIn = useIsLoggedIn();
  if (!isMobile) return null;

  return (
    <Button
      {...buttonProps}
      block
      variant={buttonProps.variant ?? 'outline'}
      loading={isLoading}
      disabled={!slug || !isSupported || !isLoggedIn}
      onClick={() => navigate(`/auto-trader/${slug ?? ''}`)}
    >
      <div>
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
