import { Switch } from 'antd';
import { useCallback } from 'react';
import {
  useAccountQuery,
  useDailyMagicStatusMutation,
  useSubscription,
} from 'api';
import useModal from 'modules/shared/useModal';
import SubscribeModalContent from './SubscribeModalContent';

export default function ToggleDaily() {
  const account = useAccountQuery();
  const { isActive } = useSubscription();

  const dailyMagicStatus = useDailyMagicStatusMutation();
  const [subscribeModal, openSubscribeModal] = useModal(SubscribeModalContent, {
    centered: true,
  });

  const onChange = useCallback(
    (checked: boolean) => {
      if (isActive) {
        dailyMagicStatus.mutate(checked);
      } else {
        void openSubscribeModal({});
      }
    },
    [dailyMagicStatus, isActive, openSubscribeModal],
  );

  return (
    <div className="mb-6 flex justify-between border-b border-white/20 pb-6">
      <p className="text-xl text-white mobile:text-base">
        Customize Notification
      </p>
      <div className="flex items-center gap-3">
        <p className="text-xl text-white mobile:text-sm">
          {account.data?.daily_magic_enabled ? 'On' : 'Off'}
        </p>
        <Switch
          onChange={onChange}
          loading={dailyMagicStatus.isLoading}
          checked={!!account.data?.daily_magic_enabled}
        />
      </div>
      {subscribeModal}
    </div>
  );
}
