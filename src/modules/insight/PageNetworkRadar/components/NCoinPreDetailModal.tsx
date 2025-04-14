import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { DrawerModal } from 'shared/DrawerModal';

import { type NetworkRadarNCoin } from 'api/insight/network';
import { Coin } from 'shared/Coin';
import { Button } from 'shared/v1-components/Button';
import { isDebugMode } from 'utils/version';
import { NCoinAge } from './NCoinAge';
import { NCoinSecurity } from './NCoinSecurity';
import { NCoinDetails } from './NCoinDetails';
import { NCoinRecentCandles } from './NCoinRecentCandles';

export const NCoinPreDetailModal: FC<{
  value: NetworkRadarNCoin | null;
  open?: boolean;
  onClose: () => unknown;
}> = ({ open, onClose, value }) => {
  const { t } = useTranslation('common');
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
              <NCoinAge
                value={value.creation_datetime}
                inline
                className="h-8 !gap-1 rounded-lg px-2 text-xs bg-v1-surface-l-next"
                imgClassName="size-5"
              />
            </div>
            <div className="flex flex-col items-end gap-px">
              <NCoinRecentCandles
                value={open ? value : undefined}
                height={50}
                width={65}
                renderer="canvas"
              />
            </div>
          </div>
          <NCoinSecurity
            value={value}
            type="card"
            imgClassName="size-4"
            className="text-[11px]"
          />

          <NCoinDetails value={value} />

          {/* TODO: @arash16 Buy/Sell Button in Mobile */}
          {isDebugMode && (
            <Button
              variant="primary"
              block
              className="w-full"
              onClick={() =>
                alert(
                  'This button is only shown in debug mode and serves as a placeholder/showcase. The action will be handled in the future.',
                )
              }
            >
              {t('buy_and_sell')}
            </Button>
          )}
        </div>
      )}
    </DrawerModal>
  );
};
