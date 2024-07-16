import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

type OrderType = 'limit' | 'market';
interface Props {
  value: OrderType;
  onChange: (value: OrderType) => void;
}

const OrderTypeToggle: React.FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation('builder');

  const itemClassName = clsx(
    'flex grow cursor-pointer items-center justify-center rounded-lg px-3 hover:bg-black/20',
  );

  return (
    <div className="flex h-5 items-stretch justify-stretch gap-1 px-3 text-center text-xs">
      <div
        className={clsx(
          itemClassName,
          value === 'limit' ? '!bg-white text-black' : 'text-white/50',
        )}
        onClick={() => onChange('limit')}
      >
        {t('common:order-type.limit')}
      </div>
      <div
        className={clsx(
          itemClassName,
          value === 'market' ? '!bg-white text-black' : 'text-white/50',
        )}
        onClick={() => onChange('market')}
      >
        {t('common:order-type.market')}
      </div>
    </div>
  );
};

export default OrderTypeToggle;
