import { useTranslation } from 'react-i18next';
import { bxCopy } from 'boxicons-quasar';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import {
  useClaimReferralBonusBag,
  useFriendsQuery,
  useReferralStatusQuery,
} from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import Badge from 'shared/Badge';
import Icon from 'shared/Icon';
import { Input } from 'shared/v1-components/Input';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';
import { useReferral } from 'modules/account/PageReferral/useReferral';
import ReferralQrCode from 'shared/ShareTools/ReferralQrCode';
import { ReferralShareLinks } from 'shared/ShareTools/ReferralShareLinks';
import useRewardModal from 'modules/account/PageRewards/RewardModal/useRewardModal';
import useModal from 'shared/useModal';
import ReferralOnboardingModalContent from 'modules/account/PageReferral/ReferralOnboarding/ReferralOnboardingModalContent';
import trader from './images/trader.png';
import { ReactComponent as Logo } from './images/logo.svg';
import { ReactComponent as Users } from './images/users.svg';
import { ReactComponent as IconUser } from './images/user.svg';
import { ReactComponent as Bag } from './images/bag.svg';
import { ReactComponent as Gift } from './images/gift.svg';
import coin from './images/coin.png';
import logoOutline from './images/logo-outline.png';
import gradient1 from './images/gradient-1.png';
// eslint-disable-next-line import/max-dependencies
import gradient2 from './images/gradient-2.png';

export default function ReferralPage() {
  const { t } = useTranslation('auth');
  const [RewardModal, openRewardModal] = useRewardModal();
  const [rewardAmount, setRewardAmount] = useState(0);
  const { data: referral, isLoading } = useReferralStatusQuery();
  const { data: referredUsers } = useFriendsQuery();
  const myReferralLink = useReferral();
  const navigate = useNavigate();
  const el = useRef<HTMLDivElement>(null);
  const [ReferralOnboardingModal, openReferralOnboardingModal] = useModal(
    ReferralOnboardingModalContent,
    { fullscreen: true, closable: false },
  );
  const [done] = useLocalStorage('referral-onboarding', false);

  const [copy, content] = useShare('copy');

  const { mutateAsync: claimBonusBag, isLoading: claimIsLoading } =
    useClaimReferralBonusBag();

  const claim = () => {
    setRewardAmount(referral?.ready_to_claim ?? 0);
    void claimBonusBag().then(() => openRewardModal({ amount: rewardAmount }));
  };

  useEffect(() => {
    if (!done) {
      void openReferralOnboardingModal({});
    }
  }, [done, openReferralOnboardingModal]);

  return (
    <PageWrapper loading={isLoading} className="mobile:pt-12">
      <h1 className="mb-2">{t('page-referral.title')}</h1>
      <p className="mb-2 text-sm text-v1-content-secondary">
        {t('page-referral.subtitle')}
      </p>

      <Button
        variant="link"
        className="mb-3 !p-0 !text-v1-content-link"
        onClick={() => openReferralOnboardingModal({})}
      >
        {t('page-referral.how.button')}
      </Button>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2 flex flex-col-reverse gap-4 mobile:col-span-5 mobile:flex-col">
          <div className="rounded-xl bg-v1-surface-l2 p-4 mobile:bg-transparent mobile:p-0">
            <h2 className="mb-2">{t('page-referral.referral-link')}</h2>
            <div className="rounded-xl bg-v1-surface-l2 mobile:p-4">
              <div
                ref={el}
                className="relative overflow-hidden rounded-xl bg-v1-surface-l2 p-4"
              >
                <img
                  src={logoOutline}
                  alt=""
                  className="absolute left-0 top-0 w-4/5"
                />
                <img
                  src={gradient1}
                  alt=""
                  className="absolute left-0 top-0 h-[200%] w-full opacity-50"
                />
                <img
                  src={gradient2}
                  alt=""
                  className="absolute left-0 top-0 h-full w-full opacity-50"
                />
                <ReferralQrCode className="relative !text-xs" />
              </div>

              <Input
                readOnly={true}
                className="my-6 w-full"
                suffixIcon={
                  <Icon
                    name={bxCopy}
                    className="ml-3"
                    onClick={() => copy(myReferralLink)}
                  />
                }
                value={myReferralLink}
              />
              <ReferralShareLinks screenshotTarget={el} fileName="referral" />
            </div>
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-v1-inverse-overlay-100/5">
                    <Bag />
                  </div>
                  <div>
                    <h3>${referral?.ready_to_claim.toFixed(2)}</h3>
                    <p className="text-xs">{t('page-referral.bonus.ready')}</p>
                  </div>
                </div>
                <hr className="my-3  border-v1-border-primary/30" />
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

          <div className="flex h-16 items-center gap-3 rounded-xl bg-v1-surface-l2 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-v1-inverse-overlay-100/5">
              <Users />
            </div>
            <div>
              <h2>{referral?.referred_users_count}</h2>
              <p className="text-xs text-v1-content-secondary">
                {t('page-referral.total-referrals')}
              </p>
            </div>
            <div className="ml-8 h-full border border-v1-border-primary/10"></div>
            <div className="flex h-full max-w-64 grow flex-col justify-between">
              <div className="flex items-center justify-between text-xs">
                <span className="text-v1-content-secondary">
                  {t('page-referral.subscription')}
                </span>
                <span>{referral?.active_referred_users_count}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-v1-content-secondary">
                  {t('page-referral.trader')}
                </span>
                <span>{referral?.trader_referred_users_count}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-v1-surface-l2 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-v1-inverse-overlay-100/5">
                <Logo />
              </div>
              <div>
                <h2>${referral?.referral_subscription_revenue.toFixed(2)}</h2>
                <p className="text-xs text-v1-content-secondary">
                  {t('page-referral.earned-subscription')}
                </p>
              </div>
            </div>
            <hr className="my-3 border-v1-border-primary/10" />
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-v1-inverse-overlay-100/5">
                <img src={trader} className="h-6 w-6 rounded-full" alt="" />
              </div>
              <div>
                <h2>${referral?.referral_trade_revenue.toFixed(2)}</h2>
                <p className="text-xs text-v1-content-secondary">
                  {t('page-referral.earned-trader')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 rounded-xl bg-v1-surface-l2 p-3 mobile:col-span-5">
          <div className="mb-2 flex items-center gap-3">
            <h2>{t('page-referral.friends-list.title')}</h2>
            <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-v1-surface-l3 text-xs">
              {referredUsers?.count ?? 0}
            </div>
          </div>

          {referredUsers?.results.map(user => (
            <div
              key={user.created_at}
              className="mb-3 flex items-center gap-3 rounded-xl bg-v1-surface-l2 p-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-v1-surface-l4">
                <IconUser />
              </div>
              <div>
                <h3 className="w-28 truncate text-sm">{user.name}</h3>
                <p className="text-xxs text-v1-content-secondary">
                  {new Date(user.created_at).toLocaleString()}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <Badge
                  className={user.is_subscribed ? '' : 'grayscale'}
                  label={
                    <span className="-ml-3">
                      <Logo className="inline h-4" />
                      {t('page-referral.subscription')}
                    </span>
                  }
                  color="orange"
                />

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
      {content}
      {RewardModal}
      {ReferralOnboardingModal}
    </PageWrapper>
  );
}
