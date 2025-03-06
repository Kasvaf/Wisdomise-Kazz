import PageWrapper from 'modules/base/PageWrapper';
import {
  useGamificationProfileQuery,
  useGamificationRewards,
} from 'api/gamification';
import { PageTitle } from 'shared/PageTitle';
import { ReactComponent as Usdt } from './images/usdt.svg';
import logo from './images/logo.svg';
import bg from './images/bg.png';
import video from './images/video.webm';

export default function PageRewards() {
  const { isLoading } = useGamificationProfileQuery();
  const { subReferral, tradeReferral, daily } = useGamificationRewards();

  return (
    <PageWrapper loading={isLoading}>
      <PageTitle
        className="py-5"
        title="Rewards"
        description="Track Your Reward History and Manage Unclaimed Rewards."
      />

      <RewardItem title="Daily Trade" image={logo} amount={daily} />
      <RewardItem title="Referral Trade" image={logo} amount={tradeReferral} />
      <RewardItem
        title="Referral Subscription"
        image={logo}
        amount={subReferral}
      />
      <p className="my-2 text-xs text-v1-content-secondary">
        Withdrawal will be available soon...
      </p>
      {/* <RewardItem title="League" image={league} amount={0} /> */}
      {/* <RewardItem title="Tournaments" image={logo} amount={0} /> */}
    </PageWrapper>
  );
}

function RewardItem({
  title,
  image,
  amount,
}: {
  title: string;
  image: string;
  amount: number;
}) {
  return (
    <div className="relative mb-3 h-24 overflow-hidden rounded-xl">
      <video
        className="absolute h-full w-full object-cover opacity-40 mix-blend-luminosity"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={video} />
      </video>
      <img src={bg} alt="" className="absolute h-full w-full" />
      <div className="relative flex h-full items-center">
        <div className="grow p-3">
          <img src={image} alt="" className="size-10" />
          <p className="mt-2">{title}</p>
        </div>
        <div className="flex h-full w-32 items-center justify-center gap-2 border-l border-dashed border-v1-border-disabled">
          <Usdt /> {amount}
        </div>
      </div>
    </div>
  );
}
