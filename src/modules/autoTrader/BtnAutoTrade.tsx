import { useNavigate } from 'react-router-dom';
import { useSupportedPairs } from 'api';
import { Button } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';

export const BtnAutoTrade: React.FC<{ slug?: string; className?: string }> = ({
  slug,
  className,
}) => {
  const { data: supportedPairs, isLoading } = useSupportedPairs(slug);
  const isSupported = !!supportedPairs?.length;
  const navigate = useNavigate();
  if (!useIsMobile()) return null;

  return (
    <Button
      block
      className={className}
      variant="outline"
      loading={isLoading}
      disabled={!slug || !isSupported}
      onClick={() => navigate(`/auto-trader/${slug ?? ''}`)}
    >
      <div>
        <div>Auto Trade</div>
        {!isSupported && !isLoading && (
          <div className="text-xxs">Not Supported</div>
        )}
      </div>
    </Button>
  );
};
