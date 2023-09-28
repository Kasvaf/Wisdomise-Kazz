import { clsx } from 'clsx';
import { bxlTelegram } from 'boxicons-quasar';
import Icon from 'shared/Icon';

const TelegramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('rounded-full p-2', className)}>
    <Icon name={bxlTelegram} />
  </div>
);

export default TelegramIcon;
