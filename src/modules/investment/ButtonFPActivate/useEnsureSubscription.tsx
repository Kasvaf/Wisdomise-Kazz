import { bxLock } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { usePlansQuery, useSubscription } from 'api';
import Icon from 'shared/Icon';
import useConfirm from 'shared/useConfirm';
import { type FinancialProduct } from 'api/types/financialProduct';

const LockIcon = () => (
  <div className="mb-4 rounded-full bg-white/10 p-4">
    <Icon name={bxLock} className="text-warning" size={40} />
  </div>
);

export default function useEnsureSubscription(
  fp: FinancialProduct,
): [JSX.Element, () => Promise<boolean>] {
  const { t } = useTranslation('products');
  const { level: myLevel } = useSubscription();
  const fpLevel = fp.config.subscription_level ?? 0;

  const { data: plans } = usePlansQuery();
  const minPlan = plans?.results.find(x => x.level === fpLevel)?.name;

  const [Modal, showModal] = useConfirm({
    title: myLevel
      ? t('subscription.upgrade.title')
      : t('subscription.subscribe.title'),
    icon: <LockIcon />,
    yesTitle: myLevel
      ? t('subscription.upgrade.btn-confirm')
      : t('subscription.subscribe.btn-confirm'),
    message: myLevel ? (
      <div className="text-center">
        <div className="mt-2 text-slate-400">
          <div>{t('subscription.upgrade.subtitle')}</div>
          <div className="mt-4">
            <Trans i18nKey="subscription.upgrade.description" ns="products">
              To use this product, you need to
              <span className="text-white">Upgrade</span> your subscription to{' '}
              <span className="text-white">{{ minPlan }}</span>.
            </Trans>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center">
        <div className="mt-2 text-slate-400">
          <Trans i18nKey="subscription.subscribe.description" ns="products">
            To activate a product, you need to
            <span className="text-white">Subscribe</span> to our
            <span className="text-white">{{ minPlan }}</span> plan.
          </Trans>
        </div>
      </div>
    ),
  });

  const navigate = useNavigate();
  return [
    Modal,
    async () => {
      if (fpLevel <= myLevel) {
        return true;
      }

      if (await showModal()) {
        navigate('/account/billing');
      }

      return false;
    },
  ];
}
