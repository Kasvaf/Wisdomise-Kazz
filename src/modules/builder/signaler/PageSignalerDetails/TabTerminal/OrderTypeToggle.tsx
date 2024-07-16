import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

type OrderType = 'limit' | 'market';
interface Props {
  value: OrderType;
  onChange: (value: OrderType) => void;
  disabled?: boolean;
}

const OrderTypeToggle: React.FC<Props> = ({ value, onChange, disabled }) => {
  const { t } = useTranslation('builder');

  const itemClassName = clsx(
    'flex grow items-center justify-center rounded-lg px-3',
  );

  return (
    <div className="flex h-5 items-stretch justify-stretch gap-1 px-3 text-center text-xs">
      <div
        className={clsx(
          itemClassName,
          disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-black/20',
          value === 'limit' ? '!bg-white text-black' : 'text-white/50',
        )}
        onClick={() => !disabled && onChange('limit')}
      >
        {t('common:order-type.limit')}
      </div>
      <div
        className={clsx(
          itemClassName,
          disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-black/20',
          value === 'market' ? '!bg-white text-black' : 'text-white/50',
        )}
        onClick={() => !disabled && onChange('market')}
      >
        {t('common:order-type.market')}
      </div>
    </div>
  );
};

export default OrderTypeToggle;
