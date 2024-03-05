import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { ColorByRisk } from './constants';

const RiskBadge: React.FC<{
  risk?: 'High' | 'Medium' | 'Low';
  className?: string;
}> = ({ risk, className }) => {
  const { t } = useTranslation('products');
  const label = {
    'Low': t('product-detail.risk.low'),
    'Medium': t('product-detail.risk.medium'),
    'High': t('product-detail.risk.high'),
    '': '',
  }[risk || ''];

  return (
    <div
      className={clsx(
        'flex-1 whitespace-pre rounded-full text-center',
        ColorByRisk[risk || 'Low'],
        className,
      )}
    >
      {t('product-detail.risk.label', { risk: label })}
    </div>
  );
};

export default RiskBadge;
