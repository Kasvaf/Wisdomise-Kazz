import { Trans, useTranslation } from 'react-i18next';
import { usePlansQuery, useSubscription } from 'api';
import Button from 'shared/Button';

const UnprivilegedOverlay: React.FC<{ requiredLevel: number }> = ({
  requiredLevel,
}) => {
  const { t } = useTranslation('billing');
  const { isFreePlan } = useSubscription();
  const { data: plans } = usePlansQuery();
  const level = plans?.results.find(x => x.level === requiredLevel)?.name;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-error/90">
        <Trans ns="billing" i18nKey="overlay-subscription.strategy.description">
          To reveal this strategy, you need to have{' '}
          <span className="font-semibold text-white">{{ level }}</span> or a
          higher plan
        </Trans>
      </div>

      <Button to="/account/billing" className="mt-2">
        {isFreePlan
          ? t('overlay-subscription.btn-subscribe')
          : t('overlay-subscription.btn-upgrade')}
      </Button>
    </div>
  );
};

export default function useNotificationLevelOverlay(sLevel: number) {
  const { level: myLevel } = useSubscription();
  return sLevel > myLevel && <UnprivilegedOverlay requiredLevel={sLevel} />;
}
