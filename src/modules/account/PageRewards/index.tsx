import PageWrapper from 'modules/base/PageWrapper';
import { useGamificationProfile } from 'api/gamification';
import usdt from './images/usdt.svg';

export default function PageRewards() {
  const { data: profile, isLoading } = useGamificationProfile();

  const usdtAmount =
    profile?.rewards?.find(reward => reward.fieldName === 'tether')?.statistical
      ?.sum ?? 0;

  return (
    <PageWrapper loading={isLoading}>
      <div className="mt-3 rounded-xl bg-v1-surface-l2 px-2 py-3">
        <div className="flex items-center gap-3">
          <img src={usdt} alt="ton" className="ms-2 h-8 w-8" />
          <div>
            <p className="text-xs">USDT Tokens Earned</p>
            <p className="mt-2 text-xs text-white/40">{usdtAmount} until now</p>
          </div>
          {/* <Button className="ms-auto w-36" size="small" disabled={true}> */}
          {/*   Coming Soon... */}
          {/* </Button> */}
        </div>
      </div>
    </PageWrapper>
  );
}
