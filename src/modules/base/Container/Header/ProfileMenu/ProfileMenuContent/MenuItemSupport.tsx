import { openHubSpot } from 'config/hubSpot';
import { IconHelp } from './icons';
import MenuItem from './MenuItem';
import BoxedIcon from './BoxedIcon';

const MenuItemSupport = () => {
  return (
    <MenuItem
      href="#"
      onClick={e => {
        e.preventDefault();
        openHubSpot();
      }}
    >
      <BoxedIcon icon={IconHelp} variant="brand" />
      Need Help?{' '}
      <span className="text-xs text-v1-content-secondary">
        We’ve got you—chat with us!
      </span>
    </MenuItem>
  );
};

export default MenuItemSupport;
