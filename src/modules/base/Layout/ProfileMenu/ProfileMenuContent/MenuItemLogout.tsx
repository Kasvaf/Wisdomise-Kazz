import { useLogoutMutation } from 'api/auth';
import { Button } from 'shared/v1-components/Button';
import { IconSignOut } from './icons';

const MenuItemLogout = () => {
  const { mutateAsync, isPending: loggingOut } = useLogoutMutation();
  return (
    <Button
      loading={loggingOut}
      onClick={e => {
        e.preventDefault();
        void mutateAsync({});
      }}
      size="sm"
      variant="negative_outline"
    >
      <IconSignOut />
      Sign Out
    </Button>
  );
};

export default MenuItemLogout;
