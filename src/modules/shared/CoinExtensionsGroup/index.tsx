import type { FC } from 'react';
import useIsMobile from 'utils/useIsMobile';
import { AlertButton } from './AlertButton';
import { GlobalSearch } from './GlobalSearch';

export const CoinExtensionsGroup: FC = () => {
  const isMobile = useIsMobile();
  return (
    <div className="flex items-center gap-2">
      <GlobalSearch
        className="min-w-[122px] grow"
        size={isMobile ? 'sm' : 'xs'}
        surface={isMobile ? 2 : 1}
      />
      <AlertButton
        className="ms-6 shrink-0 max-md:ms-0"
        size={isMobile ? 'sm' : 'xs'}
        surface={isMobile ? 2 : 1}
      />
    </div>
  );
};
