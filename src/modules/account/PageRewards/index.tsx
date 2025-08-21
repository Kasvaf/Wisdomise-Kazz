import { notification } from 'antd';
import { useHasFlag } from 'api';
import { useActiveWallet } from 'api/chains/wallet';
import {
  useGamificationRewards,
  useRewardsHistoryQuery,
  useWithdrawRewardMutation,
} from 'api/gamification';
import logo from 'assets/monogram-green.svg';
import PageWrapper from 'modules/base/PageWrapper';
import BtnSolanaWallets from 'modules/base/wallet/BtnSolanaWallets';
import { useState } from 'react';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import { PageTitle } from 'shared/PageTitle';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { shortenAddress } from 'utils/shortenAddress';
import useIsMobile from 'utils/useIsMobile';
import { isProduction } from 'utils/version';
import dailySrc from './images/daily.png';
import leagueSrc from './images/league.png';
import refFeeSrc from './images/ref-fee.png';
import refSubSrc from './images/ref-sub.png';
import { ReactComponent as Usdc } from './images/usdc.svg';
import wiseGold from './images/wise-gold.png';
import { ReactComponent as Withdraw } from './images/withdraw.svg';

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
    <PageWrapper extension={!isMobile && <CoinExtensionsGroup />} hasBack>
      <PageTitle
        className="py-5"
        description="Track Your Reward History and Manage Unclaimed Rewards."
        title="Rewards"
      />

      {hasFlag('/account/rewards?withdraw') && (
        <div className="relative mb-6 overflow-hidden rounded-xl bg-v1-surface-l1">
          <div className="relative flex mobile:flex-wrap items-center gap-3 p-4">
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
                <BtnSolanaWallets className="!bg-transparent" showAddress />
              </div>
              <Button
                className="mobile:w-full w-48"
                disabled={unclaimed === 0 || disableWithdraw}
                loading={isWithdrawLoading}
                onClick={withdraw}
                size="md"
                variant="primary"
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
        className="mb-4"
        onChange={newValue => setActiveTab(newValue)}
        options={[
          { value: 'rewards', label: 'Rewards History' },
          { value: 'withdraws', label: 'Withdraw Requests' },
        ]}
        surface={1}
        value={activeTab}
      />

      {activeTab === 'rewards' && (
        <div>
          {hasFlag('/trader/quests/daily') && (
            <RewardItem amount={daily} image={dailySrc} title="Daily Trade" />
          )}
          <RewardItem
            amount={tradeReferral}
            image={refFeeSrc}
            title="Referral Trade"
          />
          {hasFlag('/account/billing') && (
            <RewardItem
              amount={subReferral}
              image={refSubSrc}
              title="Referral Wise Club"
            />
          )}
          {hasFlag('/trader/quests/league') && (
            <RewardItem amount={league} image={leagueSrc} title="League" />
          )}
          {hasFlag('/trader/quests/tournaments') && (
            <RewardItem amount={tournament} image={logo} title="Tournaments" />
          )}
          {hasFlag('/account/billing') && (
            <RewardItem amount={wiseClub} image={wiseGold} title="Wise Club" />
          )}
        </div>
      )}

      {activeTab === 'withdraws' && (
        <div>
          {history?.map((item, index) => (
            <div
              className="mb-3 flex flex-col gap-2 rounded-xl bg-v1-surface-l1 p-3 text-xs"
              key={index}
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
                  onClick={() => openTransaction(item.transaction_hash ?? '')}
                  size="md"
                  variant="link"
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
    <div className="relative mb-3 h-24 overflow-hidden rounded-xl bg-v1-surface-l1">
      <div className="relative flex h-full items-center">
        <div className="flex grow mobile:flex-col gap-x-3 p-3">
          <img alt="" className="size-10 object-contain" src={image} />
          <p className="mt-2">{title}</p>
        </div>
        <div className="flex h-full w-32 items-center justify-center gap-2 border-v1-border-disabled border-l border-dashed">
          <Usdc className="size-6" /> {amount}
        </div>
      </div>
    </div>
  );
}
