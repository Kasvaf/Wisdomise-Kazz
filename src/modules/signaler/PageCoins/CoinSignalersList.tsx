import { bxRightArrowAlt } from 'boxicons-quasar';
import { Trans, useTranslation } from 'react-i18next';
import { usePlansQuery, useSubscription } from 'api';
import { type PairSignalerItem } from 'api/signaler';
import Icon from 'shared/Icon';
import Button from 'shared/Button';
import Locker from 'shared/Locker';
import Card from 'shared/Card';
import ActivePosition from '../ActivePosition';

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

const CoinSignalersList: React.FC<{ signalers?: PairSignalerItem[] }> = ({
  signalers,
}) => {
  const { level } = useSubscription();
  if (!signalers) return null;

  return (
    <div className="flex flex-col gap-6">
      {signalers.map(s => (
        <Locker
          key={s.strategy.key}
          overlay={
            (s.strategy.profile.subscription_level ?? 0) > level && (
              <UnprivilegedOverlay
                requiredLevel={s.strategy.profile.subscription_level ?? 0}
              />
            )
          }
          className="justify-center"
        >
          <div className="rounded-2xl bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="mx-3 text-2xl">
                  {s.strategy.profile.title || s.strategy.name}
                </h2>
              </div>

              <div className="flex items-center">
                <Button
                  to={`/insight/signaler?coin=${s.pair_name}&strategy=${s.strategy.key}`}
                >
                  Explore
                  <Icon name={bxRightArrowAlt} />
                </Button>
              </div>
            </div>

            <ActivePosition signaler={s} />
          </div>
        </Locker>
      ))}
    </div>
  );
};

export default CoinSignalersList;
