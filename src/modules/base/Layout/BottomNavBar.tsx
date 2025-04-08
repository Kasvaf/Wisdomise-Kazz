import { useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { LoadingBadge, useLoadingBadge } from 'shared/LoadingBadge';
import useIsMobile from 'utils/useIsMobile';
import MenuItems from './MenuItems';

const BottomNavbar: React.FC<{ className?: string }> = ({ className }) => {
  const location = useLocation();
  const showLoadingBadge = useLoadingBadge();
  const isMobile = useIsMobile();

  return location.pathname.startsWith('/account') ? null : (
    <>
      {isMobile && (
        <LoadingBadge
          value={showLoadingBadge}
          animation="slide-down"
          className="fixed bottom-16 left-1/2 z-50 mb-2 -translate-x-1/2"
        />
      )}

      <div className={clsx('h-16', className)}>
        <MenuItems className="h-16 bg-v1-surface-l2" />
      </div>
    </>
  );
};

export default BottomNavbar;
