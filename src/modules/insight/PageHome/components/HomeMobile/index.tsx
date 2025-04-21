import UserAssets from 'modules/autoTrader/UserAssets';
import { HotCoinsTable } from './HotCoinsTable';

export const HomeMobile = () => {
  return (
    <>
      <UserAssets className="mb-4" />
      <HotCoinsTable />
    </>
  );
};
