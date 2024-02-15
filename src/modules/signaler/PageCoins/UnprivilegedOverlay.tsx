import { Trans, useTranslation } from 'react-i18next';
import { usePlansQuery, useSubscription } from 'api';
import Button from 'shared/Button';
import Card from 'shared/Card';

const UnprivilegedOverlay: React.FC<{ requiredLevel: number }> = ({
  requiredLevel,
}) => {
  const { t } = useTranslation('billing');
  const { isFreePlan } = useSubscription();
  const { data: plans } = usePlansQuery();
  const level = plans?.results.find(x => x.level === requiredLevel)?.name;

  return (
    <Card className="flex flex-col items-center !bg-[#343942] !p-4 text-center">
      <div className="mt-2 text-white/70">
        <Trans ns="billing" i18nKey="overlay-subscription.strategy.description">
          To reveal this strategy, you need to have{' '}
          <span className="font-semibold text-white">{{ level }}</span> or a
          higher plan
        </Trans>
      </div>
      <Button to="/account/billing" className="mt-3">
        {isFreePlan
          ? t('overlay-subscription.btn-subscribe')
          : t('overlay-subscription.btn-upgrade')}
      </Button>
    </Card>
  );
};

export default UnprivilegedOverlay;
