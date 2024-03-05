import { clsx } from 'clsx';
import { bxInfoCircle } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import Card from 'shared/Card';

const NoticeBox: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation('products');

  return (
    <Card className={clsx('!p-4 text-xs text-white/60 opacity-70', className)}>
      <div className="flex gap-4">
        <Icon name={bxInfoCircle} className="shrink-0 text-warning" />
        <div>{t('product-detail.disclaimer')}</div>
      </div>
    </Card>
  );
};

export default NoticeBox;
