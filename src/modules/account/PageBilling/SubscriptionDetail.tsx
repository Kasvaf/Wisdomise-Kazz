import dayjs from 'dayjs';
import { useSubscription } from 'api';
import Button from 'modules/shared/Button';

const useSubscriptionMessage = () => {
  const { isActive, isCanceled, cancelEnd, subscriptionPortal } =
    useSubscription();
  return (
    <div className="flex flex-col items-start">
      <p className="text-white/60">
        {isActive
          ? isCanceled
            ? `Your subscription remains active until ${dayjs(cancelEnd).format(
                'MMMM DD',
              )}, and after that, no further charges will be applied. To continue enjoying our services, you can renew your subscription or explore new options in the billing tab. Your choice, your experience!`
            : 'You have successfully subscribed to one of our plans.'
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
