import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { ReadableNumber } from 'shared/ReadableNumber';
import Badge from 'shared/Badge';

const OrdersList: React.FC<{
  title: string;
  items?: Array<{
    key: string;
    amount_ratio?: number;
    applied?: boolean;
    applied_at?: string | null;
    price_exact?: number | null;
  }>;
  className?: string;
  priceClassName?: string;
}> = ({ title, items, className, priceClassName }) => {
  const { t } = useTranslation('strategy');
  if (!items) return null;

  return (
    <div className={className}>
      <h3 className="mb-1 text-sm text-white/30">{title}</h3>

      {items.map((item, ind) => (
        <div
          key={item.key}
          className="mb-1.5 flex items-center justify-between rounded-lg bg-black/15 px-2 py-1 text-xxs"
        >
          <div className="flex items-center gap-1">
            {ind + 1}. {title}{' '}
            {item.applied && (
              <Badge color="white" label={t('position-detail-modal.hitted')} />
            )}
            {item.applied_at && (
              <span className="font-normal text-white/50">
                {dayjs(item.applied_at).format('HH:mm, MMM DD')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <ReadableNumber label="%" value={(item.amount_ratio ?? 0) * 100} />
            <span>at</span>
            <span className={clsx('text-sm', priceClassName)}>
              <ReadableNumber
                label="$"
                value={item.price_exact}
                emptyText="N/A"
              />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;
