import WalletDropdownContent from '../Header/WalletDropdown/WalletDropdownContent';
import MenuItemsContent from './MenuItemsContent';

const PageMenu = () => {
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
