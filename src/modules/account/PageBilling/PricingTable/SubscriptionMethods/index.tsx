import { clsx } from 'clsx';
import { ReactComponent as GPayIcon } from './gpay.svg';
import { ReactComponent as StripeIcon } from './stripe.svg';
import { ReactComponent as PaypalIcon } from './paypal.svg';
import { ReactComponent as ApplePayIcon } from './applepay.svg';
import { ReactComponent as BitcoinIcon } from './bitcoin.svg';

export function SubscriptionMethods({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'flex w-full max-w-[900px] flex-nowrap items-center justify-between gap-x-8 overflow-auto',
        '[&>*]:shrink-0',
        className,
      )}
    >
      <GPayIcon />
      <StripeIcon />
      <PaypalIcon />
      <ApplePayIcon />
      <BitcoinIcon />
    </div>
  );
}
