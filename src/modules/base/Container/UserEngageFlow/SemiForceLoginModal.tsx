import { type FC, useEffect, useRef } from 'react';
import { useModalLogin } from '../../auth/ModalLogin';

export const SemiForceLoginModal: FC<{
  open: boolean;
}> = ({ open }) => {
  const [loginModal, showLoginModal] = useModalLogin();
  const isCalled = useRef(false);
  useEffect(() => {
    if (open && !isCalled.current) {
      isCalled.current = true;
      void showLoginModal();
    }
  }, [open, showLoginModal]);

  return <>{open && loginModal}</>;
};
