import { type SubscriptionPlan } from 'api/types/subscription';
import LeftSection from './LeftSection';
import RightSection from './RightSection';

interface Props {
  plan: SubscriptionPlan;
  onResolve: () => void;
}

export default function CryptoPaymentModalContent({ plan, onResolve }: Props) {
  return (
    <div className="no-scrollbar flex h-screen w-full mobile:flex-col mobile:overflow-auto">
      <LeftSection plan={plan} />
      <RightSection plan={plan} onResolve={onResolve} />
    </div>
  );
}
