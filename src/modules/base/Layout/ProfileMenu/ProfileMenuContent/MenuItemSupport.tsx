import { openHubSpot } from 'config/hubSpot';
import BoxedIcon from './BoxedIcon';
import { IconHelp } from './icons';
import MenuItem from './MenuItem';

const MenuItemSupport = () => {
  return (
    <MenuItem
      href="#"
      noArrow
      onClick={e => {
        e.preventDefault();
        openHubSpot();
      }}
    >
      <BoxedIcon icon={IconHelp} variant="brand" />
      Need Help?{' '}
      <span className="text-v1-content-secondary text-xs">
        We’ve got you—chat with us!
      </span>
    </MenuItem>
  );
};

export default MenuItemSupport;
