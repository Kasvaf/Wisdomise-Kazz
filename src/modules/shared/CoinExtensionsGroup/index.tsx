import type { FC } from 'react';
import useIsMobile from 'utils/useIsMobile';
import { AlertButton } from './AlertButton';
import { GlobalSearch } from './GlobalSearch';

export const CoinExtensionsGroup: FC = () => {
  const _isMobile = useIsMobile();
  return (
    <>
      <GlobalSearch
        className="max-md:!p-0 grow max-md:h-xs max-md:w-xs md:min-w-[122px]"
        size="xs"
        surface={1}
      />
      <AlertButton
        className="ms-6 shrink-0 max-md:ms-0"
        size="xs"
        surface={1}
      />
    </>
  );
};
