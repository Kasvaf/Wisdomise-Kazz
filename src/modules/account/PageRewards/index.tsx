import { notification } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import PageWrapper from 'modules/base/PageWrapper';
import {
  useWithdrawRewardMutation,
  useGamificationProfile,
  useGamificationRewards,
  useRewardsHistoryQuery,
} from 'api/gamification';
import { PageTitle } from 'shared/PageTitle';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as Usdc } from './images/usdc.svg';
import { ReactComponent as Withdraw } from './images/withdraw.svg';
import logo from './images/logo.svg';
import gradient from './images/gradient.png';
import dailySrc from './images/daily.png';
import refSubSrc from './images/ref-sub.png';
import refFeeSrc from './images/ref-fee.png';

export default function PageRewards() {
  const { isLoading } = useGamificationProfile();
  const { subReferral, tradeReferral, daily, total, claimed } =
    useGamificationRewards();
  const { data: history } = useRewardsHistoryQuery();
  const { mutateAsync, isLoading: isWithdrawLoading } =
    useWithdrawRewardMutation();
  const { publicKey } = useWallet();

  const disableWithdraw = history?.[0]?.status === 'pending';

  const withdraw = () => {
    if (!publicKey) {
      notification.error({
        message: 'Please connect your wallet address',
      });
      return;
    }
    void mutateAsync({ solana_wallet_address: publicKey.toString() }).then(
      () => {
        notification.success({
          message:
            'Withdrawal registered! You will get your tokens within 72 hours.',
        });
        return null;
      },
    );
  };

  return (
    <PageWrapper loading={isLoading}>
      <PageTitle
        className="py-5"
        title="Rewards"
        description="Track Your Reward History and Manage Unclaimed Rewards."
      />

      <div className="relative mb-6 overflow-hidden rounded-xl">
        <img src={gradient} alt="" className="absolute h-full w-full" />
        <div className="relative flex items-center gap-3 p-4 mobile:flex-wrap">
          <Usdc className="size-8" />
          <div>
            <h2 className="font-semibold">{total - claimed} USDC </h2>
            <p className="text-xs">Ready to Withdraw</p>
          </div>
          <Button
            variant="primary"
            className="ml-auto w-48 mobile:w-full"
            size="md"
            loading={isWithdrawLoading}
            disabled={disableWithdraw}
            onClick={withdraw}
          >
            <Withdraw />
            Withdraw
          </Button>
        </div>
      </div>

      <h2 className="mb-2">Reward History</h2>
      <RewardItem title="Daily Trade" image={dailySrc} amount={daily} />
      <RewardItem
        title="Referral Trade"
        image={refFeeSrc}
        amount={tradeReferral}
      />
      <RewardItem
        title="Referral Subscription"
        image={refSubSrc}
        amount={subReferral}
      />
      <RewardItem title="Total" image={logo} amount={total} />
      <RewardItem title="Withdrawn to Wallet" image={logo} amount={claimed} />
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
    <div className="relative mb-3 h-24 overflow-hidden rounded-xl bg-v1-surface-l3">
      <div className="relative flex h-full items-center">
        <div className="grow p-3">
          <img src={image} alt="" className="size-10" />
          <p className="mt-2">{title}</p>
        </div>
        <div className="flex h-full w-32 items-center justify-center gap-2 border-l border-dashed border-v1-border-disabled bg-v1-surface-l2">
          <Usdc className="size-6" /> {amount}
        </div>
      </div>
    </div>
  );
}
