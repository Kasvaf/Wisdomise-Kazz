import { bxLock } from 'boxicons-quasar';
import { useNavigate } from 'react-router-dom';
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
  const { isTrialing, isCanceled } = useSubscription();
  const canActivate = usePlanMetadata('activate_fp');
  const isSubscribe = isTrialing || isCanceled;

  const [Modal, showModal] = useConfirm({
    title: isSubscribe ? 'Subscription' : 'Upgrade Subscription',
    icon: <LockIcon />,
    yesTitle: isSubscribe ? 'Subscribe' : 'Upgrade',
    message: isSubscribe ? (
      <div className="text-center">
        <div className="mt-2 text-slate-400">
          To activate a product, you need to{' '}
          <span className="text-white">Subscribe</span> to our{' '}
          <span className="text-white">Wisdomise Expert</span> plan.
        </div>
      </div>
    ) : (
      <div className="text-center">
        <div className="mt-2 text-slate-400">
          <div>
            Your current subscription does not include the products you want to
            activate.
          </div>
          <div className="mt-4">
            To use this product, you need to{' '}
            <span className="text-white">Upgrade</span> your subscription.
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
