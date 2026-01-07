import { bxLogIn, bxLogOut } from 'boxicons-quasar';
import type { FC } from 'react';
import { useLogoutMutation } from 'services/rest/auth';
import Icon from 'shared/Icon';
import { Button, type ButtonProps } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';
import { useIsLoggedIn } from '../auth/jwt-store';
import { useModalLogin } from '../auth/ModalLogin';

export const BtnLoginLogout: FC<Omit<ButtonProps, 'onClick'>> = ({
  ...buttonProps
}) => {
  const isMobile = useIsMobile();
  const isLoggedIn = useIsLoggedIn();
  const { mutateAsync: logout, isPending: loggingOut } = useLogoutMutation();
  const [ModalLogin, showModalLogin] = useModalLogin();

  return (
    <>
      <Button
        loading={loggingOut}
        onClick={e => {
          e.preventDefault();
          if (isLoggedIn) {
            logout({});
          } else {
            showModalLogin();
          }
        }}
        size={isMobile ? 'md' : 'sm'}
        surface={1}
        variant={isLoggedIn ? 'negative_outline' : 'primary'}
        {...buttonProps}
      >
        <Icon
          className="-ms-1 me-1 size-4"
          name={isLoggedIn ? bxLogOut : bxLogIn}
          size={16}
        />
        {isLoggedIn ? 'Logout' : 'Login'}
      </Button>
      {!isLoggedIn && ModalLogin}
    </>
  );
};
