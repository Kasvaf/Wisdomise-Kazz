import { type FC } from 'react';
import { isMiniApp } from 'utils/version';
import { HotCoinsMiniApp } from './HotCoinsMiniApp';
import { HotCoinsMobile } from './HotCoinsMobile';

export const HotCoinsTable: FC = () => {
  return isMiniApp ? <HotCoinsMiniApp /> : <HotCoinsMobile />;
};
