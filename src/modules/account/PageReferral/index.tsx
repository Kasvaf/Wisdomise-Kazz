import {
  useClaimReferralBonusBag,
  useFriendsQuery,
  useReferralStatusQuery,
} from 'api';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import ReferralOnboardingModalContent from 'modules/account/PageReferral/ReferralOnboarding/ReferralOnboardingModalContent';
import { useReferral } from 'modules/account/PageReferral/useReferral';
import useRewardModal from 'modules/account/PageRewards/RewardModal/useRewardModal';
import { SolanaIcon } from 'modules/autoTrader/TokenActivity';
import PageWrapper from 'modules/base/PageWrapper';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Badge from 'shared/Badge';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import ReferralQrCode from 'shared/ShareTools/ReferralQrCode';
import { ReferralShareLinks } from 'shared/ShareTools/ReferralShareLinks';
import useModal from 'shared/useModal';
import { Button } from 'shared/v1-components/Button';
import EditableText from 'shared/v1-components/EditableText';
import { Table } from 'shared/v1-components/Table';
import { useLocalStorage } from 'usehooks-ts';
import { shortenAddress } from 'utils/address';
import useIsMobile from 'utils/useIsMobile';
import claimBg from './images/claim-bg.png';
import { ReactComponent as Gift } from './images/gift.svg';

export default function ReferralPage() {
  const { t } = useTranslation('auth');
  const isMobile = useIsMobile();
  const referralLink = useReferral();
  const [RewardModal, openRewardModal] = useRewardModal();
  const { data: referral, isLoading } = useReferralStatusQuery();
  const { data: referredUsers } = useFriendsQuery();
  const navigate = useNavigate();
  const [ReferralOnboardingModal, openReferralOnboardingModal] = useModal(
    ReferralOnboardingModalContent,
    { fullscreen: true, closable: false },
  );
  const [done] = useLocalStorage('referral-onboarding', false);

  const { mutateAsync: claimBonusBag, isPending: claimIsLoading } =
    useClaimReferralBonusBag();

  const tableData = useMemo(
    () => [
      {
        link: referralLink,
        rate: 0.25,
        code: referral?.referral_code,
        invitedCount: referredUsers?.count,
      },
    ],
    [referralLink, referral, referredUsers],
  );

  const claim = () => {
    void claimBonusBag().then(() =>
      openRewardModal({ amount: referral?.ready_to_claim ?? 0 }),
    );
  };

  useEffect(() => {
    if (!done) {
      void openReferralOnboardingModal({});
    }
  }, [done, openReferralOnboardingModal]);

  return (
    <PageWrapper
      className="mobile:pt-4"
      extension={!isMobile && <CoinExtensionsGroup />}
      loading={isLoading}
    >
      <div className="grid grid-cols-2 gap-5">
        {/* Referral */}
        <div className="rounded-xl bg-v1-surface-l1 p-3">
          <h1 className="mb-3 font-medium">{t('page-referral.title')}</h1>
          <p className="mb-2 text-v1-content-secondary text-xs">
            {t('page-referral.subtitle')}
          </p>

          <Button
            className="!text-v1-content-link !p-0 mb-3"
            onClick={() => openReferralOnboardingModal({})}
            variant="link"
          >
            {t('page-referral.how.button')}
          </Button>

          {/* Claim Rewards */}
          <div className="relative mb-3 overflow-hidden rounded-xl bg-v1-surface-l2">
            <img alt="" className="absolute right-0 h-full" src={claimBg} />
            <div className="relative p-5">
              <p className="text-v1-content-primary/50 text-xs">
                Read to Claim
              </p>
              <div className="mt-2 mb-3 flex items-center gap-1">
                <SolanaIcon size="sm" />
                <ReadableNumber
                  className="font-medium text-2xl"
                  format={{ decimalLength: 2 }}
                  value={referral?.ready_to_claim ?? 0}
                />
              </div>
              <p className="text-v1-content-primary/50 text-xxs">
                Your rewards will be paid in{' '}
                <span className="text-v1-content-primary">SOL</span>
              </p>
              <div className="mt-5 flex gap-2">
                <Button
                  disabled={referral?.ready_to_claim === 0 || claimIsLoading}
                  loading={claimIsLoading}
                  onClick={claim}
                  size="xs"
                  variant="white"
                >
                  Claim Rewards
                  <Gift />
                </Button>
                <Button
                  onClick={() => navigate('/account/rewards')}
                  size="xs"
                  surface={2}
                  variant="outline"
                >
                  See Your Rewards
                  <Icon name={bxRightArrowAlt} />
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-v1-surface-l2 p-5">
            <h2>
              {'Ready to Dive In?'}
              <span className="text-v1-content-brand"> 30% Referral Rate</span>
            </h2>

            <Table
              className="-mx-3 mt-5"
              columns={[
                {
                  key: 'link',
                  title: 'Referral Link',
                  render: row => (
                    <span className="max-w-40 truncate">
                      {shortenAddress(row.link, 10, 10)}
                    </span>
                  ),
                },
                {
                  key: 'rate',
                  title: 'My Rate',
                  render: row => `${row.rate * 100}%`,
                },
                {
                  key: 'code',
                  title: 'Code',
                  render: row => (
                    <EditableText defaultValue={row.code} onChange={() => {}} />
                  ),
                },
                {
                  key: 'invitedCount',
                  title: 'No. of Invited Friends',
                  render: row => row.invitedCount,
                },
                { key: 'actions', title: 'Actions', render: _row => '' },
              ]}
              dataSource={tableData}
              size="sm"
              surface={2}
            />
          </div>
        </div>

        {/* Cashback */}
        <div className="rounded-xl bg-v1-surface-l1 p-3">
          <h1 className="mb-2 flex items-center gap-2 font-medium">
            Cashback
            <Badge color="gradient" label="NEW" />
          </h1>
          <p className="mb-2 text-v1-content-secondary text-xs">
            Earn SOL from Trading on Solana
          </p>

          <Button
            className="!text-v1-content-link !p-0 mb-3"
            onClick={() => openReferralOnboardingModal({})}
            variant="link"
          >
            {t('page-referral.how.button')}
          </Button>

          {/* Claim Rewards */}
          <div className="relative mb-3 overflow-hidden rounded-xl bg-v1-surface-l2">
            <img alt="" className="absolute right-0 h-full" src={claimBg} />
            <div className="relative p-5">
              <p className="text-v1-content-primary/50 text-xs">
                Read to Claim
              </p>
              <div className="mt-2 mb-3 flex items-center gap-1">
                <SolanaIcon size="sm" />
                <ReadableNumber
                  className="font-medium text-2xl"
                  format={{ decimalLength: 2 }}
                  value={referral?.ready_to_claim ?? 0}
                />
              </div>
              <p className="text-v1-content-primary/50 text-xxs">
                Your rewards will be paid in{' '}
                <span className="text-v1-content-primary">SOL</span>
              </p>
              <div className="mt-5 flex gap-2">
                <Button
                  disabled={referral?.ready_to_claim === 0 || claimIsLoading}
                  loading={claimIsLoading}
                  onClick={claim}
                  size="xs"
                  variant="white"
                >
                  Claim Rewards
                  <Gift />
                </Button>
                <Button
                  onClick={() => navigate('/account/rewards')}
                  size="xs"
                  surface={2}
                  variant="outline"
                >
                  See Your Rewards
                  <Icon name={bxRightArrowAlt} />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-v1-surface-l2 p-5">
              <h2 className="mb-10 text-v1-content-secondary text-xs">
                Cashback
              </h2>
              <p className="text-2xl">35%</p>
            </div>
            <div className="rounded-xl bg-v1-surface-l2 p-5">
              <h2 className="mb-10 text-v1-content-secondary text-xs">
                Total SOL Volume
              </h2>
              <p className="text-2xl">598</p>
            </div>
          </div>
        </div>
      </div>
      {RewardModal}
      {ReferralOnboardingModal}
    </PageWrapper>
  );
}

export function Referral({ className }: { className?: string }) {
  const el = useRef<HTMLDivElement>(null);

  return (
    <div className={clsx(className, 'rounded-xl bg-v1-surface-l1')}>
      <div
        className="relative mb-3 overflow-hidden rounded-xl bg-v1-surface-l2 p-4"
        ref={el}
      >
        <ReferralQrCode className="!text-xs relative" />
      </div>
      <ReferralShareLinks fileName="referral" screenshotTarget={el} />
    </div>
  );
}
