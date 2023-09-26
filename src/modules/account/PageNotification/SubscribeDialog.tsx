import Button from 'modules/shared/Button';
import { ReactComponent as SubscribeLock } from '@/assets/images/subscribe-lock.svg';

export default function SubscribeDialog() {
  return (
    <div className="my-8 flex flex-col items-center text-center md:p-12">
      <SubscribeLock className="mb-4" />
      <h1 className="font-normal text-white">You are not subscribed</h1>
      <p className="text-slate-400">
        You must subscribe first to be able to set your signal notification
      </p>

      <Button className="mt-5 !w-72 max-w-full" to="/account/billing">
        Subscribe Now
      </Button>
    </div>
  );
}
