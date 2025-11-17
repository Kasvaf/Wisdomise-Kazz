import { notification } from 'antd';
import { useHasFlag } from 'api';
import { useActiveWallet } from 'api/chains/wallet';
import {
  useGamificationRewards,
  useRewardsHistoryQuery,
  useWithdrawRewardMutation,
} from 'api/gamification';
import { SolanaIcon } from 'modules/autoTrader/TokenActivity';
import PageWrapper from 'modules/base/PageWrapper';
import BtnSolanaWallets from 'modules/base/wallet/BtnSolanaWallets';
import leagueSrc from 'modules/quest/PageLeague/images/summit.png';
import { useState } from 'react';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import { PageTitle } from 'shared/PageTitle';
import { Button } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { shortenAddress } from 'utils/address';
import { formatNumber } from 'utils/numbers';
import useIsMobile from 'utils/useIsMobile';
import { isProduction } from 'utils/version';
import refFeeSrc from './images/ref-fee.png';
import { ReactComponent as Withdraw } from './images/withdraw.svg';

export default function PageRewards() {
  const isMobile = useIsMobile();
  const { tradeReferral, total, claimed, league } = useGamificationRewards();
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
        className="pb-5"
        description="Track Your Reward History and Manage Unclaimed Rewards."
        title="Rewards"
      />

      {hasFlag('/account/rewards?withdraw') && (
        <div className="relative mb-6 overflow-hidden rounded-xl bg-v1-surface-l1">
          <div className="relative flex mobile:flex-wrap items-center gap-3 p-4">
            <SolanaIcon size="md" />
            <div>
              <h2 className="font-semibold">
                {formatNumber(total - claimed, {
                  compactInteger: false,
                  minifyDecimalRepeats: false,
                  separateByComma: false,
                  decimalLength: 3,
                })}{' '}
                SOL
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
        size="md"
        surface={1}
        value={activeTab}
      />

      {activeTab === 'rewards' && (
        <div>
          <RewardItem
            amount={tradeReferral}
            image={refFeeSrc}
            title="Referral Trade"
          />
          {hasFlag('/trader/quests/league') && (
            <RewardItem amount={league} image={leagueSrc} title="League" />
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
          <SolanaIcon /> {amount}
        </div>
      </div>
    </div>
  );
}
