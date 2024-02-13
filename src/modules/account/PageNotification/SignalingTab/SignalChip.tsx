import { bxPlus, bxX } from 'boxicons-quasar';
import { notification } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { analytics } from 'config/segment';
import { unwrapErrorMessage } from 'utils/error';
import {
  useCreateSignalMutation,
  useDeleteSignalMutation,
  useUserSignalQuery,
} from 'api/notification';
import { type SupportedPair, type Strategy } from 'api/types/strategy';
import CoinsIcons from 'shared/CoinsIcons';
import Chip from 'shared/Chip';
import Icon from 'shared/Icon';
import Spin from 'shared/Spin';

const SignalChip: React.FC<{
  pair: SupportedPair;
  strategy: Strategy;
  ensureConnected: () => Promise<boolean>;
}> = ({ pair, strategy, ensureConnected }) => {
  const { t } = useTranslation('notifications');
  const signals = useUserSignalQuery();
  const signal = useMemo(
    () =>
      signals.data?.results.find(
        x => x.pair_name === pair.name && x.strategy_name === strategy.name,
      ),
    [pair.name, strategy.name, signals.data?.results],
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
          coin: pair.base_name,
          type: 'remove',
        });
      } else {
        await create({
          pair_name: pair.name,
          strategy_name: strategy.name,
        });
        void analytics.track('add_signal_for_strategy', {
          strategy: strategy.name,
          coin: pair.base_name,
          type: 'add',
        });
        notification.success({
          message: t('signaling.notification-activate-chip-message', {
            strategy: strategy.profile.title,
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

  return (
    <Chip
      key={pair.name}
      label={pair.base_name}
      leadingIcon={<CoinsIcons coins={[pair.base_name]} size="small" />}
      trailingIcon={
        isSubmitting ? <Spin /> : <Icon name={isSelected ? bxX : bxPlus} />
      }
      disabled={isSubmitting}
      selected={isSelected}
      onClick={handler}
    />
  );
};

export default SignalChip;
