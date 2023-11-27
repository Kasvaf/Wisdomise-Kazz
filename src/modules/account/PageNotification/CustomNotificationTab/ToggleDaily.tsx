import { Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  useAccountQuery,
  useDailyMagicStatusMutation,
  useSubscription,
} from 'api';
import useModal from 'modules/shared/useModal';
import SubscribeModalContent from './SubscribeModalContent';

export default function ToggleDaily() {
  const { t } = useTranslation('notifications');
  const account = useAccountQuery();
  const { isActive, weeklyCustomNotificationCount } = useSubscription();

  const dailyMagicStatus = useDailyMagicStatusMutation();
  const [subscribeModal, openSubscribeModal] = useModal(SubscribeModalContent, {
    centered: true,
  });

  const onChange = (checked: boolean) => {
    if (isActive && weeklyCustomNotificationCount > 0) {
      dailyMagicStatus.mutate(checked);
    } else {
      void openSubscribeModal({});
    }
  };

  return (
    <div className="mb-6 flex justify-between border-b border-white/20 pb-6">
      <p className="text-xl text-white mobile:text-base">
        {t('customs.title')}
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
