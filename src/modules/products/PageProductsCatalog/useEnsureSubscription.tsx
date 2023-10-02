import { bxLock } from 'boxicons-quasar';
import { type PropsWithChildren } from 'react';
import { usePlanMetadata } from 'api';
import { type SubscriptionPlan } from 'api/types/subscription';
import Icon from 'shared/Icon';
import Button from 'shared/Button';
import useConfirm from 'shared/useConfirm';

const LockIcon = () => (
  <div className="mb-4 rounded-full bg-white/10 p-4">
    <Icon name={bxLock} className="text-warning" size={40} />
  </div>
);

const LockContent: React.FC<PropsWithChildren> = ({ children }) => (
  <>
    <h1 className="text-white">You are not subscribed</h1>
    <div className="mt-2 text-slate-400">{children}</div>
    <Button to="/account/billing" className="mt-6">
      Subscribe
    </Button>
  </>
);

export default function useEnsureSubscription(
  permission: keyof SubscriptionPlan['metadata'],
  message: string | React.ReactNode,
): [JSX.Element, () => Promise<boolean>] {
  const canActivate = usePlanMetadata(permission);
  const [Modal, showModal] = useConfirm({
    icon: <LockIcon />,
    message: <LockContent>{message}</LockContent>,
  });

  return [
    Modal,
    async () => {
      if (!canActivate) {
        await showModal();
        return false;
      }
      return true;
    },
  ];
}
