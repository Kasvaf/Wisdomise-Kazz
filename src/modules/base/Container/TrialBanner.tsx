import { useSubscription } from 'api';
import Button from 'modules/shared/Button';

export default function TrialBanner() {
  const { remaining } = useSubscription();

  return (
    <div className="fixed inset-x-0 top-0 z-[2] flex h-14 w-full items-center justify-center bg-[#4B175C] text-white">
      <div className="flex max-w-screen-2xl items-center justify-between gap-10">
        <div className="">
          Your trial subscription ends in{' '}
          <span className="mx-1 rounded-full border border-white/20 px-3 py-2">
            {remaining}
          </span>{' '}
          days!
        </div>
        <div className="flex items-center gap-2">
          <div>Check out our subscription plans from here</div>
          <Button size="small" to="/account/billing">
            subscription plans
          </Button>
        </div>
      </div>
    </div>
  );
}
