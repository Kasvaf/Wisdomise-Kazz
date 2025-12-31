import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { type FC, useEffect, useState } from 'react';
import { useUserStorage } from 'services/rest/userStorage';
import { Dialog } from 'shared/v1-components/Dialog';
import ArenaOnboarding from './ArenaOnboarding';

export const ArenaOnboardingModal: FC = () => {
  const isLoggedIn = useIsLoggedIn();
  const [open, setOpen] = useState(false);
  const { value, save, isFetching } = useUserStorage<boolean>(
    'arena-onboarding-z4',
    {
      serializer: 'json',
    },
  );

  const isFirstTime = isLoggedIn && !isFetching && !value;

  useEffect(() => {
    if (isFirstTime) {
      setOpen(true);
    }
  }, [isFirstTime]);

  return (
    <Dialog
      className="z-[2_147_483_647] w-96 max-w-[calc(100%-2rem)]" // z-index: 1 unit higher than cookie-bot banner
      closable={false}
      footer={false}
      modalConfig={{
        closeButton: false,
      }}
      mode="modal"
      open={open}
      surface={1}
    >
      <ArenaOnboarding
        onResolve={() => {
          save(true);
          setOpen(false);
        }}
      />
    </Dialog>
  );
};
