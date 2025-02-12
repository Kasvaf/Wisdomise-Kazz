import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { MobileSearchBar } from 'shared/MobileSearchBar';
import { HotCoinsTable } from './HotCoinsTable';
import UserAssets from './UserAssets';

export const HomeMobile = () => {
  const isLoggedIn = useIsLoggedIn();

  return (
    <>
      <MobileSearchBar className="mb-4" />
      {isLoggedIn && <UserAssets className="mb-4" />}
      <HotCoinsTable />
    </>
  );
};
