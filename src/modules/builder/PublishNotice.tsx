import { clsx } from 'clsx';
import Card from 'shared/Card';

const PublishNotice: React.FC<{
  type: 'signaler' | 'fp';
  className?: string;
}> = ({ type, className }) => (
  <Card className={clsx('mt-12 !p-4 text-sm opacity-70', className)}>
    <div className="flex items-center gap-4">
      {/* <Icon name={bxInfoCircle} className="shrink-0 text-warning" /> */}
      <div>
        To publish your {type === 'fp' ? 'financial product' : 'signaler'},
        contact support via the button at the bottom right or email{' '}
        <a href="mailto:support@wisdomise.com" className="text-info">
          support@wisdomise.com
        </a>
        .
      </div>
    </div>
  </Card>
);

export default PublishNotice;
