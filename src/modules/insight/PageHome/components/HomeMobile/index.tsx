import HotCoinsTable from './HotCoinsTable';
import UserAssets from './UserAssets';

export const HomeMobile = () => {
  return (
    <>
      <UserAssets className="mb-4" />
      <HotCoinsTable />
    </>
  );
};
