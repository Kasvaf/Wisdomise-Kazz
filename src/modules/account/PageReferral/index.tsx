import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { clsx } from 'clsx';
import {
  useClaimReferralBonusBag,
  useFriendsQuery,
  useHasFlag,
  useReferralStatusQuery,
} from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import Badge from 'shared/Badge';
import { Button } from 'shared/v1-components/Button';
import ReferralQrCode from 'shared/ShareTools/ReferralQrCode';
import { ReferralShareLinks } from 'shared/ShareTools/ReferralShareLinks';
import useRewardModal from 'modules/account/PageRewards/RewardModal/useRewardModal';
import useModal from 'shared/useModal';
import ReferralOnboardingModalContent from 'modules/account/PageReferral/ReferralOnboarding/ReferralOnboardingModalContent';
import useIsMobile from 'utils/useIsMobile';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import trader from './images/trader.png';
import { ReactComponent as WiseClub } from './images/wise-club.svg';
import { ReactComponent as Users } from './images/users.svg';
import { ReactComponent as IconUser } from './images/user.svg';
import { ReactComponent as Bag } from './images/bag.svg';
import { ReactComponent as Gift } from './images/gift.svg';
import coin from './images/coin.png';

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
      hasBack
      title={t('base:menu.referral.title')}
      loading={isLoading}
      className="mobile:pt-4"
      extension={!isMobile && <CoinExtensionsGroup />}
    >
      <h1 className="mb-2">{t('page-referral.title')}</h1>
      <p className="text-v1-content-secondary mb-2 text-sm">
        {t('page-referral.subtitle')}
      </p>

      <Button
        variant="link"
        className="!text-v1-content-link mb-3 !p-0"
        onClick={() => openReferralOnboardingModal({})}
      >
        {t('page-referral.how.button')}
      </Button>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2 flex flex-col-reverse gap-4 mobile:col-span-5 mobile:flex-col">
          <div className="bg-v1-surface-l1 rounded-xl p-4 mobile:bg-transparent mobile:p-0">
            <h2 className="mb-2">{t('page-referral.referral-link')}</h2>
            <Referral className="mobile:p-4" />
          </div>

          <div>
            <h2 className="mb-2 hidden mobile:block">
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
                  <div className="bg-v1-inverse-overlay-100/5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <Bag />
                  </div>
                  <div>
                    <h3>${referral?.ready_to_claim.toFixed(2)}</h3>
                    <p className="text-xs">{t('page-referral.bonus.ready')}</p>
                  </div>
                </div>
                <hr className="border-v1-border-primary/30  my-3" />
                <p className="mb-3 text-xs">
                  {t('page-referral.bonus.description')}{' '}
                  <button
                    className="underline"
                    onClick={() => navigate('/account/rewards')}
                  >
                    See your rewards
                  </button>
                </p>
                <Button
                  variant="ghost"
                  className="mt-3 w-full max-w-[16rem] !bg-black disabled:!bg-[unset]"
                  size="md"
                  loading={claimIsLoading}
                  disabled={referral?.ready_to_claim === 0 || claimIsLoading}
                  onClick={claim}
                >
                  <Gift />
                  {t('page-referral.bonus.claim')}
                </Button>
              </div>
              <img src={coin} className="h-40" alt="" />
            </div>
          </div>

          <div className="bg-v1-surface-l1 flex h-16 items-center gap-3 rounded-xl p-3">
            <div className="bg-v1-inverse-overlay-100/5 flex h-8 w-8 items-center justify-center rounded-lg">
              <Users />
            </div>
            <div>
              <h2>{referral?.referred_users_count}</h2>
              <p className="text-v1-content-secondary text-xs">
                {t('page-referral.total-referrals')}
              </p>
            </div>
            <div className="border-v1-border-primary/10 ml-8 h-full border"></div>
            <div className="max-w-64 flex h-full grow flex-col justify-between">
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

          <div className="bg-v1-surface-l1 rounded-xl p-3">
            {hasFlag('/account/billing') && (
              <>
                <div className="flex items-center gap-3">
                  <div className="bg-v1-inverse-overlay-100/5 flex h-8 w-8 items-center justify-center rounded-lg">
                    <WiseClub />
                  </div>
                  <div>
                    <h2>
                      ${referral?.referral_subscription_revenue.toFixed(2)}
                    </h2>
                    <p className="text-v1-content-secondary text-xs">
                      {t('page-referral.earned-subscription')}
                    </p>
                  </div>
                </div>
                <hr className="border-v1-border-primary/10 my-3" />
              </>
            )}
            <div className="flex items-center gap-3">
              <div className="bg-v1-inverse-overlay-100/5 flex h-8 w-8 items-center justify-center rounded-lg">
                <img src={trader} className="h-6 w-6 rounded-full" alt="" />
              </div>
              <div>
                <h2>${referral?.referral_trade_revenue.toFixed(2)}</h2>
                <p className="text-v1-content-secondary text-xs">
                  {t('page-referral.earned-trader')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-v1-surface-l1 col-span-3 rounded-xl p-3 mobile:col-span-5">
          <div className="mb-2 flex items-center gap-3">
            <h2>{t('page-referral.friends-list.title')}</h2>
            <div className="bg-v1-surface-l3 flex h-6 w-6 items-center justify-center rounded-xl text-xs">
              {referredUsers?.count ?? 0}
            </div>
          </div>

          {referredUsers?.results.map(user => (
            <div
              key={user.created_at}
              className="bg-v1-surface-l1 mb-3 flex items-center gap-3 rounded-xl p-3"
            >
              <div className="bg-v1-surface-l4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
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
                    label={
                      <span className="-ml-3">
                        <WiseClub className="inline h-4" />
                        {t('page-referral.subscription')}
                      </span>
                    }
                    color="orange"
                  />
                )}

                <Badge
                  className={user.is_trader ? '' : 'grayscale'}
                  label={
                    <span className="-ml-3">
                      <img
                        src={trader}
                        className="mr-1 inline h-4 rounded-full"
                        alt=""
                      />
                      {t('page-referral.trader')}
                    </span>
                  }
                  color="blue"
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
    <div className={clsx(className, 'bg-v1-surface-l1 rounded-xl')}>
      <div
        ref={el}
        className="bg-v1-surface-l2 relative mb-3 overflow-hidden rounded-xl p-4"
      >
        <ReferralQrCode className="relative !text-xs" />
      </div>
      <ReferralShareLinks screenshotTarget={el} fileName="referral" />
    </div>
  );
}
