import { useSubscription } from 'api';
import Button from 'modules/shared/Button';

const useSubscriptionMessage = () => {
  const { isActive, subscriptionPortal } = useSubscription();
  return (
    <div className="flex flex-col items-start">
      <p className="text-white/60">
        {isActive
          ? 'You have successfully subscribed to one of our plans.'
          : 'Please go to your billing portal to renew or upgrade your subscription:'}
      </p>

      <Button to={subscriptionPortal} className="mt-4 block" target="_blank">
        Billing portal
      </Button>
    </div>
  );
};

export default function SubscriptionDetail() {
  const message = useSubscriptionMessage();

  return (
    <>
      <h1 className="mb-4 text-base font-semibold text-white">
        Subscription details
      </h1>
      {message}
    </>
  );
}
