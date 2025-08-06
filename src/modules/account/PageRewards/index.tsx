/* eslint-disable import/max-dependencies */
import { notification } from 'antd';
import { useState } from 'react';
import PageWrapper from 'modules/base/PageWrapper';
import {
  useWithdrawRewardMutation,
  useGamificationRewards,
  useRewardsHistoryQuery,
} from 'api/gamification';
import { PageTitle } from 'shared/PageTitle';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { isProduction } from 'utils/version';
import { shortenAddress } from 'utils/shortenAddress';
import { useHasFlag } from 'api';
import useIsMobile from 'utils/useIsMobile';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import logo from 'assets/monogram-green.svg';
import { useActiveWallet } from 'api/chains/wallet';
import BtnSolanaWallets from 'modules/base/wallet/BtnSolanaWallets';
import { ReactComponent as Usdc } from './images/usdc.svg';
import { ReactComponent as Withdraw } from './images/withdraw.svg';
import gradient from './images/gradient.png';
import dailySrc from './images/daily.png';
import refSubSrc from './images/ref-sub.png';
import refFeeSrc from './images/ref-fee.png';
import leagueSrc from './images/league.png';
import wiseGold from './images/wise-gold.png';

export default function PageRewards() {
  const isMobile = useIsMobile();
  const {
    subReferral,
    tradeReferral,
    daily,
    total,
    claimed,
    league,
    tournament,
    wiseClub,
  } = useGamificationRewards();
  const { data: history } = useRewardsHistoryQuery();
  const { mutateAsync, isPending: isWithdrawLoading } =
    useWithdrawRewardMutation();
  const { address } = useActiveWallet();
  const disableWithdraw = history?.[0]?.status === 'pending';
  const unclaimed = total - claimed;
  const [activeTab, setActiveTab] = useState('rewards');
  const hasFlag = useHasFlag();

  const openTransaction = (txHash: string) => {
    const url = new URL(`https://solscan.io/tx/${txHash}`);
    if (!isProduction) {
      url.searchParams.set('cluster', 'devnet');
    }
    window.open(url, '_blank');
  };

  const withdraw = () => {
    if (!address) {
      notification.error({
        message:
          'Please connect your wallet or use a custodial wallet to continue.',
      });
      return;
    }
    void mutateAsync({ solana_wallet_address: address }).then(() => {
      notification.success({
        message:
          'Withdrawal registered! You will get your tokens within few days.',
      });
      return null;
    });
  };

  return (
    <PageWrapper hasBack extension={!isMobile && <CoinExtensionsGroup />}>
      <PageTitle
        className="py-5"
        title="Rewards"
        description="Track Your Reward History and Manage Unclaimed Rewards."
      />

      {hasFlag('/account/rewards?withdraw') && (
        <div className="relative mb-6 overflow-hidden rounded-xl">
          <img src={gradient} alt="" className="absolute h-full w-full" />
          <div className="relative flex items-center gap-3 p-4 mobile:flex-wrap">
            <Usdc className="size-8" />
            <div>
              <h2 className="font-semibold">
                {(total - claimed).toFixed(2)} USDC
              </h2>
              <p className="text-xs">Ready to Withdraw</p>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <div className="flex items-center text-xs">
                Withdraw Wallet:
                <BtnSolanaWallets showAddress className="!bg-transparent" />
              </div>
              <Button
                variant="primary"
                className="w-48 mobile:w-full"
                size="md"
                loading={isWithdrawLoading}
                disabled={unclaimed === 0 || disableWithdraw}
                onClick={withdraw}
              >
                <Withdraw />
                Withdraw
              </Button>
              {disableWithdraw && (
                <p className="text-v1-content-secondary text-xs">
                  You have Pending Withdraw Request
                </p>
              )}
            </div>
          </div>
        </div>
      )}

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
          {hasFlag('/trader/quests/daily') && (
            <RewardItem title="Daily Trade" image={dailySrc} amount={daily} />
          )}
          <RewardItem
            title="Referral Trade"
            image={refFeeSrc}
            amount={tradeReferral}
          />
          {hasFlag('/account/billing') && (
            <RewardItem
              title="Referral Wise Club"
              image={refSubSrc}
              amount={subReferral}
            />
          )}
          {hasFlag('/trader/quests/league') && (
            <RewardItem title="League" image={leagueSrc} amount={league} />
          )}
          {hasFlag('/trader/quests/tournaments') && (
            <RewardItem title="Tournaments" image={logo} amount={tournament} />
          )}
          {hasFlag('/account/billing') && (
            <RewardItem title="Wise Club" image={wiseGold} amount={wiseClub} />
          )}
        </div>
      )}

      {activeTab === 'withdraws' && (
        <div>
          {history?.map((item, index) => (
            <div
              key={index}
              className="bg-v1-surface-l2 mb-3 flex flex-col gap-2 rounded-xl p-3 text-xs"
            >
              <div className="flex justify-between">
                <div className="text-v1-content-secondary">Wallet Address</div>
                <div>{shortenAddress(item.address)}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-v1-content-secondary">Status</div>
                <div>{item.status.toUpperCase()}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-v1-content-secondary">USD Amount</div>
                <div>${item.amount_usd.toFixed(2)}</div>
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
    <div className="bg-v1-surface-l2 relative mb-3 h-24 overflow-hidden rounded-xl">
      <div className="relative flex h-full items-center">
        <div className="flex grow gap-x-3 p-3 mobile:flex-col">
          <img src={image} alt="" className="size-10 object-contain" />
          <p className="mt-2">{title}</p>
        </div>
        <div className="border-v1-border-disabled flex h-full w-32 items-center justify-center gap-2 border-l border-dashed">
          <Usdc className="size-6" /> {amount}
        </div>
      </div>
    </div>
  );
}
