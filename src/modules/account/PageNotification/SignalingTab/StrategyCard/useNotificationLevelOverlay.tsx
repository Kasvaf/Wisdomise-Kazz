import { bxLock } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { usePlansQuery, useSubscription } from 'api';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import Card from 'shared/Card';

const UnprivilegedOverlay: React.FC<{ requiredLevel: number }> = ({
  requiredLevel,
}) => {
  const { t } = useTranslation('billing');
  const { isFreePlan } = useSubscription();
  const { data: plans } = usePlansQuery();
  const level = plans?.results.find(x => x.level === requiredLevel)?.name;

  return (
    <Card className="mt-12 flex flex-col items-center !bg-[#343942] text-center">
      <div className="mb-4 rounded-full bg-white/10 p-4">
        <Icon name={bxLock} className="text-warning" size={40} />
      </div>

      <h1 className="text-white">{t('overlay-subscription.strategy.title')}</h1>
      <div className="mt-2 text-slate-400">
        {t('overlay-subscription.strategy.description', { level })}
      </div>

      <Button to="/account/billing" className="mt-6">
        {isFreePlan
          ? t('overlay-subscription.btn-subscribe')
          : t('pricing-card.btn-action.upgrade')}
      </Button>
    </Card>
  );
};

export default function useNotificationLevelOverlay(sLevel: number) {
  const { isSignalNotificationEnable, level: myLevel } = useSubscription();
  return (
    isSignalNotificationEnable &&
    sLevel > myLevel && <UnprivilegedOverlay requiredLevel={sLevel} />
  );
}
