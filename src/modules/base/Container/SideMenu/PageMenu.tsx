import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useIsMobile from 'utils/useIsMobile';
import WalletDropdownContent from '../Header/WalletDropdown/WalletDropdownContent';
import MenuItemsContent from './MenuItemsContent';

const PageMenu = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isMobile) {
      navigate('/');
    }
  }, [isMobile, navigate]);

  return (
    <div>
      <div className="mb-4 overflow-hidden rounded-xl bg-black/30">
        <WalletDropdownContent />
      </div>
      <MenuItemsContent collapsed={false} />
    </div>
  );
};

export default PageMenu;
