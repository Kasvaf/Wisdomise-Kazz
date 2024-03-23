import { bxLock } from 'boxicons-quasar';
import { Trans, useTranslation } from 'react-i18next';
import { usePlansQuery, useSubscription } from 'api';
import useConfirm from 'shared/useConfirm';
import Icon from 'shared/Icon';

const LockIcon = () => (
  <div className="mb-4 rounded-full bg-white/10 p-4">
    <Icon name={bxLock} className="text-warning" size={40} />
  </div>
);

export default function useSignalSubscriptionModal(requiredLevel: number) {
  const { t } = useTranslation('strategy');
  const { level: myLevel } = useSubscription();
  const { data: plans } = usePlansQuery();
  const minPlan = plans?.results.find(x => x.level === requiredLevel)?.name;

  return useConfirm({
    title: myLevel
      ? t('matrix.subscription.upgrade.title')
      : t('matrix.subscription.subscribe.title'),
    icon: <LockIcon />,
    yesTitle: myLevel
      ? t('matrix.subscription.upgrade.btn-confirm')
      : t('matrix.subscription.subscribe.btn-confirm'),
    message: (
      <div className="text-center">
        <div className="mt-2 text-slate-400">
          {myLevel ? (
            <Trans
              i18nKey="matrix.subscription.upgrade.description"
              ns="strategy"
            >
              To view this signal, you need to
              <span className="text-white">Upgrade</span> your subscription to
              <span className="text-white">{{ minPlan }}</span>.
            </Trans>
          ) : (
            <Trans
              i18nKey="matrix.subscription.subscribe.description"
              ns="strategy"
            >
              To view this signal, you need to
              <span className="text-white">Subscribe</span> to our
              <span className="text-white">{{ minPlan }}</span> plan.
            </Trans>
          )}
        </div>
      </div>
    ),
  });
}
