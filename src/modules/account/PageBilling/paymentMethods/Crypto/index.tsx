import type { SubscriptionPlan } from 'api/types/subscription';
import LeftSection from './LeftSection';
import RightSection from './RightSection';

interface Props {
  invoiceKey?: string;
  plan: SubscriptionPlan;
  onResolve: VoidFunction;
}

export default function CryptoPaymentModalContent({
  plan,
  onResolve,
  invoiceKey,
}: Props) {
  return (
    <div className="no-scrollbar flex h-screen w-full max-md:flex-col max-md:overflow-auto">
      <LeftSection plan={plan} />
      <RightSection invoiceKey={invoiceKey} onResolve={onResolve} plan={plan} />
    </div>
  );
}
