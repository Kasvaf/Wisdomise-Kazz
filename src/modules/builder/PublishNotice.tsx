import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import Card from 'shared/Card';

const supportEmail = 'support@wisdomise.com';
const PublishNotice: React.FC<{
  type: 'signaler' | 'fp';
  className?: string;
}> = ({ type, className }) => {
  const { t } = useTranslation('builder');
  return (
    <Card className={clsx('mt-12 !p-4 text-sm opacity-70', className)}>
      <div className="flex items-center gap-4">
        {/* <Icon name={bxInfoCircle} className="shrink-0 text-warning" /> */}
        <div>
          <span className="mr-1 font-bold text-white">
            {t('publish-notice.note')}
          </span>
          {t('publish-notice.description', {
            type: type === 'fp' ? 'financial product' : 'signaler',
          })}{' '}
          <a href={`mailto:${supportEmail}`} className="text-info">
            {supportEmail}
          </a>
          .
        </div>
      </div>
    </Card>
  );
};

export default PublishNotice;
