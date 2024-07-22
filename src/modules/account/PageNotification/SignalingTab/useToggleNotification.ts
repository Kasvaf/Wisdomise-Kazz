import { notification } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCreateSignalMutation,
  useDeleteSignalMutation,
  useUserSignalQuery,
} from 'api/notification';
import { unwrapErrorMessage } from 'utils/error';
import { analytics } from 'config/segment';

const useToggleNotification = ({
  pairName,
  strategy,
  ensureConnected,
}: {
  pairName: string;
  strategy: { key: string; name: string; profile?: { title: string } };
  ensureConnected: () => Promise<boolean>;
}) => {
  const { t } = useTranslation('notifications');
  const pairBaseName = pairName.replace(/(BUSD|USDT)$/, '');

  const signals = useUserSignalQuery();
  const signal = useMemo(
    () =>
      signals.data?.results.find(
        x => x.pair_name === pairName && x.strategy_name === strategy.name,
      ),
    [pairName, strategy.name, signals.data?.results],
  );
  const isSelected = !!signal;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const remove = useDeleteSignalMutation();
  const create = useCreateSignalMutation();
  const handler = async () => {
    if (!(await ensureConnected())) return;

    try {
      setIsSubmitting(true);
      if (isSelected) {
        await remove(signal.key);
        void analytics.track('add_signal_for_strategy', {
          strategy: strategy.name,
          coin: pairBaseName,
          type: 'remove',
        });
      } else {
        await create({
          pair_name: pairName,
          strategy_key: strategy.key,
        });
        void analytics.track('add_signal_for_strategy', {
          strategy: strategy.name,
          coin: pairBaseName,
          type: 'add',
        });
        notification.success({
          message: t('signaling.notification-activate-chip-message', {
            strategy: strategy.profile?.title,
          }),
          key: strategy.name,
        });
      }
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handler,
    isSelected,
    isSubmitting,
    isLoading: signals.isLoading,
  };
};

export default useToggleNotification;
