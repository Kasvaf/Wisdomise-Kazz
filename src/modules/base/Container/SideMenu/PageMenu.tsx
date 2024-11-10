import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useIsMobile from 'utils/useIsMobile';
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
      <MenuItemsContent collapsed={false} />
    </div>
  );
};

export default PageMenu;
