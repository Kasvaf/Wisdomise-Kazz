import { bxLock } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import Button from 'modules/shared/Button';
import Card from 'modules/shared/Card';
import Icon from 'modules/shared/Icon';

const UnsubscribedOverlay = () => {
  const { t } = useTranslation('billing');

  return (
    <Card className="mt-12 flex flex-col items-center !bg-[#343942] text-center">
      <div className="mb-4 rounded-full bg-white/10 p-4">
        <Icon name={bxLock} className="text-warning" size={40} />
      </div>

      <h1 className="text-white">{t('overlay-subscription.title')}</h1>
      <div className="mt-2 text-slate-400">
        {t('overlay-subscription.signaling-description')}
      </div>

      <Button to="/account/billing" className="mt-6">
        {t('overlay-subscription.btn-subscribe')}
      </Button>
    </Card>
  );
};

export default UnsubscribedOverlay;
