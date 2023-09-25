import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { getBilingPortal, useSubscription } from 'api';
import Button from 'modules/shared/Button';

const useSubscriptionMessage = () => {
  const { isActive, isCanceled, cancelEnd } = useSubscription();

  const [isLoading, setIsLoading] = useState(false);
  const bilingHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = await getBilingPortal();
      window.location.href = url;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-start">
      <p className="text-white/60">
        {isActive
          ? isCanceled
            ? `Your subscription remains active until ${dayjs(cancelEnd).format(
                'MMMM DD',
              )}, and after that, no further charges will be applied. To continue enjoying our services, you can renew your subscription or explore new options in the billing tab. Your choice, your experience!`
            : 'You have successfully subscribed to one of our plans.'
          : 'Please go to your billing portal to manage your current subscription:'}
      </p>

      <Button
        onClick={bilingHandler}
        loading={isLoading}
        className="mt-4 block"
        target="_blank"
      >
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
