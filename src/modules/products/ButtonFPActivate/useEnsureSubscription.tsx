import { bxLock } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { usePlanMetadata, useSubscription } from 'api';
import Icon from 'shared/Icon';
import useConfirm from 'shared/useConfirm';

const LockIcon = () => (
  <div className="mb-4 rounded-full bg-white/10 p-4">
    <Icon name={bxLock} className="text-warning" size={40} />
  </div>
);

export default function useEnsureSubscription(): [
  JSX.Element,
  () => Promise<boolean>,
] {
  const { t } = useTranslation('products');
  const { isTrialing, isCanceled } = useSubscription();
  const canActivate = usePlanMetadata('activate_fp');
  const isSubscribe = isTrialing || isCanceled;

  const [Modal, showModal] = useConfirm({
    title: isSubscribe
      ? t('subscription.subscribe.title')
      : t('subscription.upgrade.title'),
    icon: <LockIcon />,
    yesTitle: isSubscribe
      ? t('subscription.subscribe.btn-confirm')
      : t('subscription.upgrade.btn-confirm'),
    message: isSubscribe ? (
      <div className="text-center">
        <div className="mt-2 text-slate-400">
          <Trans i18nKey="subscription.subscribe.description" ns="products">
            To activate a product, you need to
            <span className="text-white">Subscribe</span> to our
            <span className="text-white">Wisdomise Expert</span> plan.
          </Trans>
        </div>
      </div>
    ) : (
      <div className="text-center">
        <div className="mt-2 text-slate-400">
          <div>{t('subscription.upgrade.subtitle')}</div>
          <div className="mt-4">
            <Trans i18nKey="subscription.upgrade.description" ns="products">
              To use this product, you need to
              <span className="text-white">Upgrade</span> your subscription.
            </Trans>
          </div>
        </div>
      </div>
    ),
  });

  const navigate = useNavigate();
  return [
    Modal,
    async () => {
      if (!canActivate) {
        if (await showModal()) {
          navigate('/account/billing');
        }

        return false;
      }
      return true;
    },
  ];
}
