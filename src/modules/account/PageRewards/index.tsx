import { notification } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import PageWrapper from 'modules/base/PageWrapper';
import {
  useWithdrawRewardMutation,
  useGamificationProfileQuery,
  useGamificationRewards,
  useRewardsHistoryQuery,
} from 'api/gamification';
import { PageTitle } from 'shared/PageTitle';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { isProduction } from 'utils/version';
import { shortenAddress } from 'utils/shortenAddress';
import { ReactComponent as Usdc } from './images/usdc.svg';
import { ReactComponent as Withdraw } from './images/withdraw.svg';
import gradient from './images/gradient.png';
import dailySrc from './images/daily.png';
import refSubSrc from './images/ref-sub.png';
import refFeeSrc from './images/ref-fee.png';

export default function PageRewards() {
  const { isLoading } = useGamificationProfileQuery();
  const { subReferral, tradeReferral, daily, total, claimed } =
    useGamificationRewards();
  const { data: history } = useRewardsHistoryQuery();
  const { mutateAsync, isLoading: isWithdrawLoading } =
    useWithdrawRewardMutation();
  const { publicKey } = useWallet();

  const disableWithdraw = history?.[0]?.status === 'pending';
  const unclaimed = total - claimed;
  const [activeTab, setActiveTab] = useState('rewards');

  const openTransaction = (txHash: string) => {
    const url = new URL(`https://solscan.io/tx/${txHash}`);
    if (!isProduction) {
      url.searchParams.set('cluster', 'devnet');
    }
    window.open(url, '_blank');
  };

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
            'Withdrawal registered! You will get your tokens within few days.',
        });
        return null;
      },
    );
  };

  return (
    <PageWrapper title="Rewards" hasBack loading={isLoading}>
      <PageTitle
        className="py-5"
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
            disabled={unclaimed === 0 || disableWithdraw}
            onClick={withdraw}
          >
            <Withdraw />
            Withdraw
          </Button>
          {(unclaimed || disableWithdraw) && (
            <p className="text-xs text-v1-content-secondary">
              You have Pending Withdraw Request
            </p>
          )}
        </div>
      </div>

      <ButtonSelect
        options={[
          { value: 'rewards', label: 'Rewards History' },
          { value: 'withdraws', label: 'Withdraw Requests' },
        ]}
        value={activeTab}
        onChange={newValue => setActiveTab(newValue)}
        className="mb-4"
      />

      {activeTab === 'rewards' && (
        <div>
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
        </div>
      )}

      {activeTab === 'withdraws' && (
        <div>
          {history?.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-xl bg-v1-surface-l2 p-3 text-xs"
            >
              <div className="flex justify-between">
                <div className="text-v1-content-secondary">Wallet Address</div>
                <div>{shortenAddress(item.address)}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-v1-content-secondary">Status</div>
                <div>{item.status}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-v1-content-secondary">USD Amount</div>
                <div>${item.amount_usd}</div>
              </div>
              {item.transaction_hash && (
                <Button
                  variant="link"
                  size="md"
                  onClick={() => openTransaction(item.transaction_hash ?? '')}
                >
                  View Transaction
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
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
