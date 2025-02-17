import { useTranslation } from 'react-i18next';
import { bxCopy, bxShareAlt } from 'boxicons-quasar';
import { useFriendsQuery, useReferralStatusQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import Badge from 'shared/Badge';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { Input } from 'shared/v1-components/Input';
import { useShare } from 'shared/useShare';
import { AUTO_TRADER_MINI_APP_BASE } from 'config/constants';
import { useTelegram } from 'modules/base/mini-app/TelegramProvider';
import { isMiniApp } from 'utils/version';
import HowReferralWorks from 'modules/account/PageReferral/HowReferralWorks';
import trader from './images/trader.png';
import { ReactComponent as Logo } from './images/logo.svg';
import { ReactComponent as Users } from './images/users.svg';
import { ReactComponent as IconUser } from './images/user.svg';

export default function ReferralPage() {
  const { t } = useTranslation('auth');
  const { data: referral, isLoading } = useReferralStatusQuery();
  const { data: referredUsers } = useFriendsQuery();

  const [copy, content] = useShare('copy');
  const [share] = useShare('share');
  const myOrigin = window.location.origin;
  const webReferralLink = `${myOrigin}/ref/${referral?.referral_code ?? ''}`;
  const tgReferralLink = `${AUTO_TRADER_MINI_APP_BASE}?startapp=referrer_${
    referral?.referral_code ?? ''
  }`;
  const myReferralLink = isMiniApp ? tgReferralLink : webReferralLink;
  const { webApp } = useTelegram();

  const shareLink = () => {
    if (isMiniApp) {
      const text = '🚀🧠 Hey there! Join Wisdomise Auto Trader';
      const share = `https://t.me/share/url?text=${text}&url=${myReferralLink}`;
      webApp?.openTelegramLink(share);
    } else {
      void share(myReferralLink);
    }
  };

  return (
    <PageWrapper loading={isLoading}>
      <h1 className="mb-2">{t('page-referral.title')}</h1>
      <p className="mb-2 text-sm text-v1-content-secondary">
        {t('page-referral.subtitle')}
      </p>
      <HowReferralWorks />

      <div
        className="inset-x-0 bottom-0 mb-5 rounded-xl bg-v1-surface-l2 p-6 mobile:fixed mobile:mb-0 mobile:rounded-none"
        style={{
          boxShadow:
            '0px -90px 25px 0px rgba(0, 0, 0, 0.00), 0px -57px 23px 0px rgba(0, 0, 0, 0.02), 0px -32px 19px 0px rgba(0, 0, 0, 0.06), 0px -14px 14px 0px rgba(0, 0, 0, 0.11), 0px -4px 8px 0px rgba(0, 0, 0, 0.13)',
        }}
      >
        <p className="mb-2 text-sm font-medium">
          {t('page-referral.referral-link')}
        </p>
        <div className="flex gap-3">
          <Input
            readOnly={true}
            className="grow"
            suffixIcon={
              <Icon
                name={bxCopy}
                className="ml-3"
                onClick={() => copy(myReferralLink)}
              />
            }
            value={myReferralLink}
          />
          <Button size="small" variant="primary" onClick={shareLink}>
            <Icon name={bxShareAlt} className="mr-2" />
            {t('page-referral.share')}
          </Button>
        </div>
      </div>

      <div className="mb-5 flex h-16 items-center gap-3 rounded-xl bg-v1-surface-l2 p-3">
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
        <div className="flex h-full grow flex-col justify-between">
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
            <h2>${referral?.referral_subscription_revenue}</h2>
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
            <h2>${referral?.referral_trade_revenue}</h2>
            <p className="text-xs text-v1-content-secondary">
              {t('page-referral.earned-trader')}
            </p>
          </div>
        </div>
      </div>

      {/* <h2 className="mb-2 mt-5">{t('page-referral.bonus.title')}</h2> */}
      {/* <div */}
      {/*   className="flex justify-between overflow-hidden rounded-xl" */}
      {/*   style={{ */}
      {/*     background: 'linear-gradient(126deg, #625134 -2.76%, #F7D57E 100%)', */}
      {/*   }} */}
      {/* > */}
      {/*   <div className="grow p-3"> */}
      {/*     <div className="flex items-center gap-3"> */}
      {/*       <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-v1-inverse-overlay-100/5"> */}
      {/*         <Bag /> */}
      {/*       </div> */}
      {/*       <div> */}
      {/*         <h3>${referral?.referral_revenue}</h3> */}
      {/*         <p className="text-xs">{t('page-referral.bonus.ready')}</p> */}
      {/*       </div> */}
      {/*     </div> */}
      {/*     <hr className="my-3 border-v1-border-primary/30" /> */}
      {/*     <p className="text-xs">{t('page-referral.bonus.description')}</p> */}
      {/*   </div> */}
      {/*   <img src={coin} className="h-40" alt="" /> */}
      {/* </div> */}

      <div>
        <div className="mb-2 mt-5 flex items-center gap-3">
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
              <h3 className="text-sm">{user.name}</h3>
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
      {content}
    </PageWrapper>
  );
}
