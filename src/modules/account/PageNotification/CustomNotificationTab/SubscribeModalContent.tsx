import { bxLock } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import Button from 'modules/shared/Button';
import Icon from 'modules/shared/Icon';

export default function SubscribeModalContent() {
  const { t } = useTranslation('notifications');

  return (
    <div className="mt-12 flex flex-col items-center text-center">
      <div className="mb-4 rounded-full bg-white/10 p-4">
        <Icon name={bxLock} className="text-warning" size={40} />
      </div>

      <h1 className="text-white">{t('overlay-subscription.title')}</h1>
      <div className="mt-2 text-slate-400">
        {t('overlay-subscription.customs-description')}
      </div>

      <Button className="mt-6" to="/account/billing">
        {t('overlay-subscription.btn-subscribe')}
      </Button>
    </div>
  );
}
