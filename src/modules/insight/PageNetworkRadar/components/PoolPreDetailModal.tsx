import { type FC } from 'react';
import { DrawerModal } from 'shared/DrawerModal';

import { type NetworkRadarPool } from 'api/insight/network';
import { Coin } from 'shared/Coin';
import { PoolAge } from './PoolAge';
import { PoolSecurity } from './PoolSecurity';
import { PoolDetails } from './PoolDetails';
import { PoolRecentCandles } from './PoolRecentCandles';

export const PoolPreDetailModal: FC<{
  value: NetworkRadarPool | null;
  open?: boolean;
  onClose: () => unknown;
}> = ({ open, onClose, value }) => {
  return (
    <DrawerModal
      open={open && !!value}
      onClose={onClose}
      closeIcon={null}
      className="[&_.ant-drawer-header]:hidden"
    >
      {value && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Coin
                coin={value.base_symbol}
                imageClassName="size-8"
                nonLink={true}
                truncate={150}
              />
              <PoolAge
                value={value.creation_datetime}
                inline
                className="h-8 !gap-1 rounded-lg px-2 text-xs bg-v1-surface-l-next"
                imgClassName="size-5"
              />
            </div>
            <div className="flex flex-col items-end gap-px">
              <PoolRecentCandles
                value={open ? value : undefined}
                height={50}
                width={65}
                renderer="canvas"
              />
            </div>
          </div>
          <PoolSecurity
            value={value}
            type="card"
            imgClassName="size-4"
            className="text-[11px]"
          />

          <PoolDetails value={value} />

          {/* <div className="flex flex-col items-stretch gap-4">
      <BtnAutoTrade slug={pool.slug} variant="primary" />
    </div> */}
        </div>
      )}
    </DrawerModal>
  );
};
