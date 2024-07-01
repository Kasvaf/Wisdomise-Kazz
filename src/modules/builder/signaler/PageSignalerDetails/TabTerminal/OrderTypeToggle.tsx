import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

type OrderType = 'limit' | 'market';
interface Props {
  value: OrderType;
  onChange: (value: OrderType) => void;
}

const OrderTypeToggle: React.FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation('builder');
  return (
    <div className="flex h-[48px] w-[62px] flex-col items-stretch justify-stretch gap-1 text-center text-xs">
      <div
        className={clsx(
          'flex grow cursor-pointer items-center justify-center rounded-lg hover:bg-black/20',
          value === 'limit' ? '!bg-black/30' : 'text-white/40',
        )}
        onClick={() => onChange('limit')}
      >
        {t('common:order-type.limit')}
      </div>
      <div
        className={clsx(
          'flex grow cursor-pointer items-center justify-center rounded-lg hover:bg-black/20',
          value === 'market' ? '!bg-black/30' : 'text-white/40',
        )}
        onClick={() => onChange('market')}
      >
        {t('common:order-type.market')}
      </div>
    </div>
  );
};

export default OrderTypeToggle;
