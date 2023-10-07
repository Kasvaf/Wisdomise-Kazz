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
  const { isTrialing } = useSubscription();
  const canActivate = usePlanMetadata('activate_fp');

  const [Modal, showModal] = useConfirm({
    title: isTrialing ? 'Subscription' : 'Upgrade Subscription',
    icon: <LockIcon />,
    yesTitle: isTrialing ? 'Subscribe' : 'Upgrade',
    message: isTrialing ? (
      <div className="text-center">
        <div className="mt-2 text-slate-400">
          To activate a product, you need to{' '}
          <span className="text-white">subscribe</span> first.
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
            To use these products, you need to{' '}
            <span className="text-white">upgrade</span> your subscription.
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
