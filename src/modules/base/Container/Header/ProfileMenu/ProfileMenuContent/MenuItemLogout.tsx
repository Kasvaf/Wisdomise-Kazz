import { Button } from 'shared/v1-components/Button';
import { useLogoutMutation } from 'api/auth';
import { IconSignOut } from './icons';

const MenuItemLogout = () => {
  const { mutateAsync, isLoading: loggingOut } = useLogoutMutation();
  return (
    <Button
      variant="negative"
      className="w-full"
      block
      loading={loggingOut}
      onClick={e => {
        e.preventDefault();
        void mutateAsync({});
      }}
    >
      <IconSignOut />
      Sign Out
    </Button>
  );
};

export default MenuItemLogout;
