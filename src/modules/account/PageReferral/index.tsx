import { notification } from 'antd';
import {
  useCashbackClaimMutation,
  useFriendsQuery,
  useReferralCodeMutation,
  useReferralStatusQuery,
  useTradeReferralClaimMutation,
} from 'api';
import { bxCopy, bxRightArrowAlt, bxShareAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useReferral } from 'modules/account/PageReferral/useReferral';
import useRewardModal from 'modules/account/PageRewards/RewardModal/useRewardModal';
import { SolanaIcon } from 'modules/autoTrader/TokenActivity';
import PageWrapper from 'modules/base/PageWrapper';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import ReferralQrCode from 'shared/ShareTools/ReferralQrCode';
import { ReferralShareLinks } from 'shared/ShareTools/ReferralShareLinks';
import { useShare } from 'shared/useShare';
import { Badge } from 'shared/v1-components/Badge';
import { Button } from 'shared/v1-components/Button';
import EditableText from 'shared/v1-components/EditableText';
import { Table } from 'shared/v1-components/Table';
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
  const [copy, content] = useShare('copy');

  const {
    mutateAsync: claimTradeReferralAsync,
    isPending: claimReferralIsLoading,
  } = useTradeReferralClaimMutation();

  const { mutateAsync: claimCashbackAsync, isPending: claimCashbackIsLoading } =
    useCashbackClaimMutation();

  const { mutateAsync: mutateReferralCode } = useReferralCodeMutation();

  const tableData = useMemo(
    () => [
      {
        link: referralLink,
        rate: referral?.referral_percent,
        code: referral?.referral_code,
        invitedCount: referredUsers?.count,
      },
    ],
    [referralLink, referral, referredUsers],
  );

  const claim = () => {
    const amount = referral?.ready_to_claim ?? 0;
    void claimTradeReferralAsync().then(() => openRewardModal({ amount }));
  };

  const claimCashback = () => {
    const amount = referral?.cashback_to_claim ?? 0;
    void claimCashbackAsync().then(() => openRewardModal({ amount }));
  };

  const updateReferralCode = (newValue: string) => {
    const regex = /^[a-z0-9]{3,10}$/;
    if (!regex.test(newValue)) {
      notification.error({
        message:
          'Code must be between 3 and 10 characters and contain only lowercase letters or numbers.',
      });
      return;
    }
    mutateReferralCode({ referral_code: newValue }).then(() => {
      notification.success({ message: 'Referral code updated successfully.' });
    });
  };

  // useEffect(() => {
  //   if (!done) {
  //     void openReferralOnboardingModal({});
  //   }
  // }, [done, openReferralOnboardingModal]);

  return (
    <PageWrapper
      className="max-md:pt-4"
      extension={!isMobile && <CoinExtensionsGroup />}
      loading={isLoading}
    >
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {/* Referral */}
        <div className="rounded-xl bg-v1-surface-l1 p-3">
          <h1 className="mb-3 font-medium">{t('page-referral.title')}</h1>
          <p className="mb-5 text-v1-content-secondary text-xs">
            {t('page-referral.subtitle')}
          </p>

          {/* <Button */}
          {/*   className="!text-v1-content-link !p-0 mb-3" */}
          {/*   onClick={() => openReferralOnboardingModal({})} */}
          {/*   variant="link" */}
          {/* > */}
          {/*   {t('page-referral.how.button')} */}
          {/* </Button> */}

          {/* Claim Rewards */}
          <div className="relative mb-3 overflow-hidden rounded-xl bg-v1-surface-l2">
            <img alt="" className="absolute right-0 h-full" src={claimBg} />
            <div className="relative p-5">
              <p className="text-v1-content-primary/50 text-xs">
                Ready to Claim
              </p>
              <div className="mt-2 mb-3 flex items-center gap-1">
                <SolanaIcon size="sm" />
                <ReadableNumber
                  className="font-medium text-2xl"
                  format={{ decimalLength: 2 }}
                  value={referral?.ready_to_claim ?? 0}
                />
              </div>
              <p className="text-2xs text-v1-content-primary/50">
                Your rewards will be paid in{' '}
                <span className="text-v1-content-primary">SOL</span>
              </p>
              <div className="mt-5 flex gap-2">
                <Button
                  disabled={referral?.ready_to_claim === 0}
                  loading={claimReferralIsLoading}
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
              <span className="text-v1-content-brand">
                {' '}
                {referral?.referral_percent}% Referral Rate
              </span>
            </h2>

            <Table
              className="-mx-3 mt-5"
              columns={[
                {
                  key: 'link',
                  title: 'Referral Link',
                  render: row => (
                    <div className="flex items-center gap-2">
                      <span className="max-w-40 truncate">
                        {shortenAddress(row.link, 10, 10)}
                      </span>
                      <Button
                        fab
                        onClick={() => copy(row.link)}
                        size="3xs"
                        surface={2}
                        variant="ghost"
                      >
                        <Icon
                          className="text-v1-content-primary/70 [&>svg]:size-4"
                          name={bxCopy}
                        />
                      </Button>
                    </div>
                  ),
                },
                {
                  key: 'rate',
                  title: 'My Rate',
                  render: () => `${referral?.referral_percent}%`,
                },
                {
                  key: 'code',
                  title: 'Code',
                  render: row => (
                    <EditableText
                      onChange={newValue => {
                        updateReferralCode(newValue);
                      }}
                      resetOnBlank
                      surface={2}
                      value={row.code}
                    />
                  ),
                },
                {
                  key: 'invitedCount',
                  title: 'No. of Invited Friends',
                  render: row => row.invitedCount,
                },
                {
                  key: 'actions',
                  title: 'Actions',
                  render: _row => (
                    <ClickableTooltip chevron={false} title={<Referral />}>
                      <Button fab size="2xs" surface={2} variant="ghost">
                        <Icon name={bxShareAlt} />
                      </Button>
                    </ClickableTooltip>
                  ),
                },
              ]}
              dataSource={tableData}
              scrollable
              size="sm"
              surface={2}
            />
          </div>
        </div>

        {/* Cashback */}
        <div className="rounded-xl bg-v1-surface-l1 p-3">
          <h1 className="mb-3 flex items-center gap-2 font-medium">
            Cashback
            <Badge color="brand" variant="solid">
              New
            </Badge>
          </h1>
          <p className="mb-5 text-v1-content-secondary text-xs">
            Earn SOL from Trading on Solana
          </p>

          {/* Claim Rewards */}
          <div className="relative mb-3 overflow-hidden rounded-xl bg-v1-surface-l2">
            <img alt="" className="absolute right-0 h-full" src={claimBg} />
            <div className="relative p-5">
              <p className="text-v1-content-primary/50 text-xs">
                Ready to Claim
              </p>
              <div className="mt-2 mb-3 flex items-center gap-1">
                <SolanaIcon size="sm" />
                <ReadableNumber
                  className="font-medium text-2xl"
                  format={{ decimalLength: 2 }}
                  value={referral?.cashback_to_claim ?? 0}
                />
              </div>
              <p className="text-2xs text-v1-content-primary/50">
                Your rewards will be paid in{' '}
                <span className="text-v1-content-primary">SOL</span>
              </p>
              <div className="mt-5 flex gap-2">
                <Button
                  disabled={referral?.cashback_to_claim === 0}
                  loading={claimCashbackIsLoading}
                  onClick={claimCashback}
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
            <h2 className="mb-10 text-v1-content-secondary text-xs">
              Cashback
            </h2>
            <p className="text-2xl">{referral?.cashback_percent}%</p>
          </div>
        </div>
      </div>
      {RewardModal}
      {content}
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
