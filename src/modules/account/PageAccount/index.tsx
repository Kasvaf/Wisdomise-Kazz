import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type FC } from 'react';
import PageWrapper from 'modules/base/PageWrapper';
import {
  useExchangeAccountsQuery,
  useReferralStatusQuery,
  useSubscription,
  useSumsubVerified,
} from 'api';
import { trackClick } from 'config/segment';
import { CardPageLink, CardPageLinkBadge } from '../../shared/CardPageLinkV2';
import KycBadge from './KycBadge';
import {
  ProfileIcon,
  UserIcon,
  SubscriptionIcon,
  KycIcon,
  WsdmTokenIcon,
  ExternalAccountIcon,
  NotificationsIcon,
  ReferralIcon,
} from './icons';

const PageAccount: FC = () => {
  const { t } = useTranslation('base');
  const subscription = useSubscription();
  const { data: exchanges } = useExchangeAccountsQuery();
  const { data: referral } = useReferralStatusQuery();
  const { data: kycStatus } = useSumsubVerified();

  return (
    <PageWrapper>
      <h1 className="mb-2 flex flex-row items-center gap-2 text-base font-bold">
        <UserIcon className="h-5 w-5" />
        {t('menu.account.title')}
      </h1>
      <p className="mb-10 text-xs text-white/60">
        {t('menu.account.subtitle')}
      </p>

      <div className="grid grid-cols-3 items-stretch gap-6 mobile:grid-cols-1">
        <CardPageLink
          to="/account/profile"
          title={t('menu.profile.title')}
          description={t('menu.profile.subtitle')}
          cta={t('common:actions.edit')}
          icon={ProfileIcon}
          onCtaClick={trackClick('profile_menu')}
        />
        <CardPageLink
          to="/account/billing"
          title={t('menu.billing.title')}
          description={t('menu.billing.subtitle')}
          cta={t('common:actions.more')}
          icon={SubscriptionIcon}
          onCtaClick={trackClick('subscription_menu')}
          footer={
            <CardPageLinkBadge color="purple">
              <span>{subscription.title}</span>
              {!subscription.isFreePlan && (
                <span
                  className={clsx(
                    'border-l border-l-white/60 pl-2',
                    subscription.remaining ? 'text-white/60' : 'text-error/60',
                  )}
                >
                  {String(subscription.remaining) + 'd'}{' '}
                  {t('menu.billing.remains')}
                </span>
              )}
            </CardPageLinkBadge>
          }
        />
        <CardPageLink
          to="/account/kyc"
          title={t('menu.kyc.title')}
          description={t('menu.kyc.subtitle')}
          cta={t('actions.complete', { ns: 'common' })}
          icon={KycIcon}
          onCtaClick={trackClick('kyc_menu')}
          footer={<KycBadge status={kycStatus} />}
        />
        <CardPageLink
          to="/account/token"
          title={t('menu.token.title')}
          description={t('menu.token.subtitle')}
          cta={t('common:actions.more')}
          icon={WsdmTokenIcon}
          onCtaClick={trackClick('wsdm_token_menu')}
        />
        <CardPageLink
          to="/account/exchange-accounts"
          title={t('menu.account-manager.title')}
          description={t('menu.account-manager.subtitle')}
          cta={t('common:actions.more')}
          icon={ExternalAccountIcon}
          onCtaClick={trackClick('external_account_menu')}
          footer={
            <CardPageLinkBadge color="purple">
              {exchanges?.length}{' '}
              {t('accounts:page-accounts.accounts-connected')}
            </CardPageLinkBadge>
          }
        />
        <CardPageLink
          to="/account/notification-center"
          title={t('menu.notification-center.title')}
          description={t('menu.notification-center.subtitle')}
          cta={t('common:actions.more')}
          icon={NotificationsIcon}
          onCtaClick={trackClick('notifications_menu')}
        />
        <CardPageLink
          to="/account/referral"
          title={t('menu.referral.title')}
          description={t('menu.referral.subtitle')}
          cta={t('common:actions.invite')}
          icon={ReferralIcon}
          onCtaClick={trackClick('referral_menu')}
          footer={
            <CardPageLinkBadge color="purple">
              {referral?.referred_users_count}{' '}
              {t('accounts:page-accounts.users-invited')}
            </CardPageLinkBadge>
          }
        />
      </div>
    </PageWrapper>
  );
};

export default PageAccount;
