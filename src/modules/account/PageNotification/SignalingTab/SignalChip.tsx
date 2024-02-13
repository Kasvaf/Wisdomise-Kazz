import { bxPlus, bxX } from 'boxicons-quasar';
import { type SupportedPair, type Strategy } from 'api/types/strategy';
import CoinsIcons from 'shared/CoinsIcons';
import Chip from 'shared/Chip';
import Icon from 'shared/Icon';
import Spin from 'shared/Spin';
import useToggleNotification from './useToggleNotification';

const SignalChip: React.FC<{
  pair: SupportedPair;
  strategy: Strategy;
  ensureConnected: () => Promise<boolean>;
}> = ({ pair, strategy, ensureConnected }) => {
  const { handler, isSelected, isSubmitting } = useToggleNotification({
    pairName: pair.name,
    strategy,
    ensureConnected,
  });

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
