import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { HotCoinsTable } from './HotCoinsTable';
import UserAssets from './UserAssets';

export const HomeMobile = () => {
  const isLoggedIn = useIsLoggedIn();

  return (
    <>
      {isLoggedIn && <UserAssets className="mb-4" />}
      <HotCoinsTable />
    </>
  );
};
