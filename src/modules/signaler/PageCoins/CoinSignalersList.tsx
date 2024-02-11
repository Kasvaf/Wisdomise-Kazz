import { bxRightArrowAlt } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { usePlansQuery, useSubscription } from 'api';
import { usePairSignalers, type SignalerPair } from 'api/signaler';
import Icon from 'shared/Icon';
import Button from 'shared/Button';
import Spinner from 'shared/Spinner';
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
    <Card className="flex flex-col items-center !bg-[#343942] text-center">
      <div className="mt-2 text-slate-400">
        {t('overlay-subscription.strategy.description', { level })}
      </div>
      <Button to="/account/billing" className="mt-3">
        {isFreePlan
          ? t('overlay-subscription.btn-subscribe')
          : t('overlay-subscription.btn-upgrade')}
      </Button>
    </Card>
  );
};

const CoinSignalersList: React.FC<{ coin: SignalerPair }> = ({ coin }) => {
  const { level } = useSubscription();
  const { data, isLoading } = usePairSignalers(coin.base.name, coin.quote.name);

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      {data.map(s => (
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
                  to={`/insight/coins/signaler?coin=${coin.name}&strategy=${s.strategy.key}`}
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
