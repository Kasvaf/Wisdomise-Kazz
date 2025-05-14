import { type FC } from 'react';
import useIsMobile from 'utils/useIsMobile';
import { GlobalSearch } from './GlobalSearch';
import { NetworkMenu } from './NetworkMenu';
import { AlertButton } from './AlertButton';

export const CoinExtensionsGroup: FC = () => {
  const isMobile = useIsMobile();
  return (
    <div className="flex items-center gap-2">
      <GlobalSearch
        surface={isMobile ? 2 : 3}
        size={isMobile ? 'sm' : 'xs'}
        className="min-w-[122px] grow"
      />
      <NetworkMenu
        surface={isMobile ? 2 : 3}
        size={isMobile ? 'sm' : 'xs'}
        className="shrink-0"
      />
      <AlertButton
        surface={isMobile ? 1 : 2}
        size={isMobile ? 'sm' : 'xs'}
        className="ms-6 shrink-0 mobile:ms-0"
      />
    </div>
  );
};
