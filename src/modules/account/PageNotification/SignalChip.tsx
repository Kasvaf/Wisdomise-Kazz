import { bxPlus, bxX } from 'boxicons-quasar';
import { notification } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import {
  useCreateSignalMutation,
  useDeleteSignalMutation,
  useUserSignalQuery,
} from 'api/notification';
import { type SupportedPair, type Strategy } from 'api/types/strategy';
import Chip from 'modules/shared/Chip';
import CoinsIcons from 'modules/shared/CoinsIcons';
import Icon from 'modules/shared/Icon';
import Spin from 'modules/shared/Spin';
import { unwrapErrorMessage } from 'utils/error';

const SignalChip: React.FC<{ pair: SupportedPair; strategy: Strategy }> = ({
  pair,
  strategy,
}) => {
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
  const handler = useCallback(async () => {
    try {
      setIsSubmitting(true);
      await (isSelected
        ? remove(signal.key)
        : create({
            pair_name: pair.name,
            strategy_name: strategy.name,
          }));
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  }, [create, isSelected, pair.name, remove, signal?.key, strategy.name]);

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
