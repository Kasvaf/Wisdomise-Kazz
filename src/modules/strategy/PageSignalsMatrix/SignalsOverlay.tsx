import { bxLock } from 'boxicons-quasar';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import Card from 'shared/Card';
import Icon from 'shared/Icon';

const SignalsOverlay = () => {
  const { t } = useTranslation('billing');
  return (
    <Card className="mt-12 flex flex-col items-center !bg-[#343942] text-center">
      <div className="mb-4 rounded-full bg-white/10 p-4">
        <Icon name={bxLock} className="text-warning" size={40} />
      </div>

      <h1 className="text-white">{t('overlay-subscription.title')}</h1>
      <div className="mt-2 text-slate-400">
        <Trans i18nKey="overlay-subscription.signals-description" ns="billing">
          To reveal all signals, you need to
          <span className="text-white">Subscribe</span> or
          <span className="text-white">Upgrade</span> your current plan.
        </Trans>
      </div>

      <Button to="/account/billing" className="mt-6">
        {t('overlay-subscription.btn-subscribe')}
      </Button>
    </Card>
  );
};

export default SignalsOverlay;
