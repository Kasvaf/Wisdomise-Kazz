import * as numerable from 'numerable';
import React from 'react';
import { type AssetBinding } from 'api/types/investorAssetStructure';
import useIsMobile from 'utils/useIsMobile';
import CoinsIcons from 'shared/CoinsIcons';
import useMainQuote from 'shared/useMainQuote';

const FpiAssetItem = ({ asset: a }: { asset: AssetBinding }) => {
  const isMobile = useIsMobile();
  const mainQuote = useMainQuote();

  return (
    <React.Fragment key={a.name}>
      <div className="mx-6 mt-4 grid w-fit shrink-0 grid-cols-2 items-center first:ml-0 mobile:mx-0 mobile:flex mobile:w-full mobile:items-center mobile:justify-between mobile:rounded-lg mobile:bg-white/5 mobile:p-2">
        <div className="flex items-center">
          <CoinsIcons size={isMobile ? 15 : 'small'} coins={[a.name]} />
          <span className="ml-2 text-xs text-white">{a.name}</span>
        </div>
        <p className="ml-4 whitespace-nowrap text-sm font-medium text-white/90 mobile:ml-0">
          {numerable.format(a.share / 100, '0,0.00 %')}
        </p>
        <p className="mobile:hidden" />
        <p className="whitespace-nowrap text-right text-xxs text-white/60 mobile:text-xs">
          {numerable.format(a.equity, '0,0.00', {
            rounding: 'floor',
          })}{' '}
          <span className="">{mainQuote}</span>
        </p>
      </div>

      <div className="mx-1 my-4 h-auto border-l border-white/10 last:hidden mobile:hidden" />
    </React.Fragment>
  );
};

export default FpiAssetItem;
