import { useSubscription } from 'api';
import Button from 'modules/shared/Button';

const useSubscriptionMessage = () => {
  const { hasSubscription, isTrialing } = useSubscription();
  if (isTrialing) {
    // hasStripe
    return (
      <div>
        <p className="text-white/60">
          Please go to your billing portal to renew your subscription:
        </p>
        <Button to="" className="mt-4">
          Billing portal
        </Button>
      </div>
    );
  }

  if (hasSubscription) {
    return (
      <p className="text-white/60">
        You have subscribed to one of our plans, which grants you a 30-day trial
        period. Payment will be required once the trial period finishes.
      </p>
    );
  }
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
