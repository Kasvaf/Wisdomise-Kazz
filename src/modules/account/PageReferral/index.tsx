import {
  useClaimReferralBonusBag,
  useFriendsQuery,
  useHasFlag,
  useReferralStatusQuery,
} from 'api';
import { clsx } from 'clsx';
import ReferralOnboardingModalContent from 'modules/account/PageReferral/ReferralOnboarding/ReferralOnboardingModalContent';
import useRewardModal from 'modules/account/PageRewards/RewardModal/useRewardModal';
import { SolanaIcon } from 'modules/autoTrader/TokenActivity';
import PageWrapper from 'modules/base/PageWrapper';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Badge from 'shared/Badge';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import ReferralQrCode from 'shared/ShareTools/ReferralQrCode';
import { ReferralShareLinks } from 'shared/ShareTools/ReferralShareLinks';
import useModal from 'shared/useModal';
import { Button } from 'shared/v1-components/Button';
import { useLocalStorage } from 'usehooks-ts';
import { formatNumber } from 'utils/numbers';
import useIsMobile from 'utils/useIsMobile';
import { ReactComponent as Bag } from './images/bag.svg';
import coin from './images/coin.png';
import { ReactComponent as Gift } from './images/gift.svg';
import trader from './images/trader.png';
import { ReactComponent as IconUser } from './images/user.svg';
import { ReactComponent as Users } from './images/users.svg';
import { ReactComponent as WiseClub } from './images/wise-club.svg';

export default function ReferralPage() {
  const { t } = useTranslation('auth');
  const isMobile = useIsMobile();
  const [RewardModal, openRewardModal] = useRewardModal();
  const { data: referral, isLoading } = useReferralStatusQuery();
  const { data: referredUsers } = useFriendsQuery();
  const navigate = useNavigate();
  const [ReferralOnboardingModal, openReferralOnboardingModal] = useModal(
    ReferralOnboardingModalContent,
    { fullscreen: true, closable: false },
  );
  const [done] = useLocalStorage('referral-onboarding', false);
  const hasFlag = useHasFlag();

  const { mutateAsync: claimBonusBag, isPending: claimIsLoading } =
    useClaimReferralBonusBag();

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
      hasBack
      loading={isLoading}
      title={t('base:menu.referral.title')}
    >
      <h1 className="mb-2">{t('page-referral.title')}</h1>
      <p className="mb-2 text-sm text-v1-content-secondary">
        {t('page-referral.subtitle')}
      </p>

      <Button
        className="!text-v1-content-link !p-0 mb-3"
        onClick={() => openReferralOnboardingModal({})}
        variant="link"
      >
        {t('page-referral.how.button')}
      </Button>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2 mobile:col-span-5 flex mobile:flex-col flex-col-reverse gap-4">
          <div className="rounded-xl bg-v1-surface-l1 mobile:bg-transparent mobile:p-0 p-4">
            <h2 className="mb-2">{t('page-referral.referral-link')}</h2>
            <Referral className="mobile:p-4" />
          </div>

          <div>
            <h2 className="mb-2 mobile:block hidden">
              {t('page-referral.bonus.title')}
            </h2>
            <div
              className="flex justify-between overflow-hidden rounded-xl"
              style={{
                background:
                  'linear-gradient(126deg, #625134 -2.76%, #F7D57E 100%)',
              }}
            >
              <div className="grow p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-v1-inverse-overlay-100/5">
                    <Bag />
                  </div>
                  <div>
                    <h3 className="flex items-center gap-1">
                      <SolanaIcon />
                      {formatNumber(referral?.ready_to_claim ?? 0, {
                        compactInteger: false,
                        minifyDecimalRepeats: false,
                        separateByComma: false,
                        decimalLength: 2,
                      })}
                    </h3>
                    <p className="text-xs">{t('page-referral.bonus.ready')}</p>
                  </div>
                </div>
                <hr className="my-3 border-v1-border-primary/30" />
                <p className="mb-3 text-xs">
                  <button
                    className="underline"
                    onClick={() => navigate('/account/rewards')}
                  >
                    See your rewards
                  </button>
                </p>
                <Button
                  className="!bg-black disabled:!bg-[unset] mt-3 w-full max-w-[16rem]"
                  disabled={referral?.ready_to_claim === 0 || claimIsLoading}
                  loading={claimIsLoading}
                  onClick={claim}
                  size="md"
                  variant="ghost"
                >
                  <Gift />
                  {t('page-referral.bonus.claim')}
                </Button>
              </div>
              <img alt="" className="h-40" src={coin} />
            </div>
          </div>

          <div className="flex h-16 items-center gap-3 rounded-xl bg-v1-surface-l1 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-v1-inverse-overlay-100/5">
              <Users />
            </div>
            <div>
              <h2>{referral?.referred_users_count}</h2>
              <p className="text-v1-content-secondary text-xs">
                {t('page-referral.total-referrals')}
              </p>
            </div>
            <div className="ml-8 h-full border border-v1-border-primary/10"></div>
            <div className="flex h-full max-w-64 grow flex-col justify-between">
              {hasFlag('/account/billing') && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-v1-content-secondary">
                    {t('page-referral.subscription')}
                  </span>
                  <span>{referral?.active_referred_users_count}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-v1-content-secondary">
                  {t('page-referral.trader')}
                </span>
                <span>{referral?.trader_referred_users_count}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-v1-surface-l1 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-v1-inverse-overlay-100/5">
                <img alt="" className="h-6 w-6 rounded-full" src={trader} />
              </div>
              <div>
                <h2 className="flex items-center gap-1">
                  <SolanaIcon />{' '}
                  {formatNumber(referral?.referral_trade_revenue ?? 0, {
                    compactInteger: false,
                    minifyDecimalRepeats: false,
                    separateByComma: false,
                    decimalLength: 2,
                  })}
                </h2>
                <p className="text-v1-content-secondary text-xs">
                  {t('page-referral.earned-trader')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 mobile:col-span-5 rounded-xl bg-v1-surface-l1 p-3">
          <div className="mb-2 flex items-center gap-3">
            <h2>{t('page-referral.friends-list.title')}</h2>
            <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-v1-surface-l3 text-xs">
              {referredUsers?.count ?? 0}
            </div>
          </div>

          {referredUsers?.results.map(user => (
            <div
              className="mb-3 flex items-center gap-3 rounded-xl bg-v1-surface-l1 p-3"
              key={user.created_at}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-v1-surface-l4">
                <IconUser />
              </div>
              <div>
                <h3 className="w-28 truncate text-sm">{user.name}</h3>
                <p className="text-v1-content-secondary text-xxs">
                  {new Date(user.created_at).toLocaleString()}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-3">
                {hasFlag('/account/billing') && (
                  <Badge
                    className={user.is_subscribed ? '' : 'grayscale'}
                    color="orange"
                    label={
                      <span className="-ml-3">
                        <WiseClub className="inline h-4" />
                        {t('page-referral.subscription')}
                      </span>
                    }
                  />
                )}

                <Badge
                  className={user.is_trader ? '' : 'grayscale'}
                  color="blue"
                  label={
                    <span className="-ml-3">
                      <img
                        alt=""
                        className="mr-1 inline h-4 rounded-full"
                        src={trader}
                      />
                      {t('page-referral.trader')}
                    </span>
                  }
                />
              </div>
            </div>
          ))}
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
