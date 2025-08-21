import type { FC } from 'react';
import useIsMobile from 'utils/useIsMobile';
import { AlertButton } from './AlertButton';
import { GlobalSearch } from './GlobalSearch';
import { NetworkMenu } from './NetworkMenu';

export const CoinExtensionsGroup: FC = () => {
  const isMobile = useIsMobile();
  return (
    <div className="flex items-center gap-2">
      <GlobalSearch
        className="min-w-[122px] grow"
        size={isMobile ? 'sm' : 'xs'}
        surface={1}
      />
      <NetworkMenu
        className="shrink-0"
        size={isMobile ? 'sm' : 'xs'}
        surface={1}
      />
      <AlertButton
        className="mobile:ms-0 ms-6 shrink-0"
        size={isMobile ? 'sm' : 'xs'}
        surface={1}
      />
    </div>
  );
};
