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
import { PageCard, type PageCardProps } from 'shared/PageCard';
import { PageTitle } from 'shared/PageTitle';
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

const useKycStatusBadge = (): Pick<PageCardProps, 'badge' | 'badgeType'> => {
  const { t } = useTranslation('kyc');
  const { data: kycStatus } = useSumsubVerified();
  const statusMap = {
    UNVERIFIED: t('badges.unverified'),
    PENDING: t('badges.pending'),
    VERIFIED: t('badges.verified'),
    REJECTED: t('badges.rejected'),
  };
  return {
    badge: statusMap[kycStatus || 'PENDING'] as PageCardProps['badge'],
    badgeType: (kycStatus === 'VERIFIED'
      ? 'green'
      : 'orange') as PageCardProps['badgeType'],
  };
};

const PageAccount: FC = () => {
  const { t } = useTranslation('base');
  const subscription = useSubscription();
  const { data: exchanges } = useExchangeAccountsQuery();
  const { data: referral } = useReferralStatusQuery();
  const kycBadge = useKycStatusBadge();

  return (
    <PageWrapper>
      <PageTitle
        className="mb-10"
        icon={UserIcon}
        title={t('menu.account.title')}
        description={t('menu.account.subtitle')}
      />

      <div className="grid grid-cols-3 gap-6 mobile:grid-cols-1">
        <PageCard
          to="/account/profile"
          title={t('menu.profile.title')}
          description={t('menu.profile.subtitle')}
          cta={t('common:actions.edit')}
          icon={ProfileIcon}
          onClick={trackClick('profile_menu')}
        />
        <PageCard
          to="/account/billing"
          title={t('menu.billing.title')}
          description={t('menu.billing.subtitle')}
          cta={t('common:actions.more')}
          icon={SubscriptionIcon}
          onClick={trackClick('subscription_menu')}
          badge={
            <>
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
            </>
          }
        />
        <PageCard
          to="/account/kyc"
          title={t('menu.kyc.title')}
          description={t('menu.kyc.subtitle')}
          cta={t('actions.complete', { ns: 'common' })}
          icon={KycIcon}
          onClick={trackClick('kyc_menu')}
          {...kycBadge}
        />
        <PageCard
          to="/account/token"
          title={t('menu.token.title')}
          description={t('menu.token.subtitle')}
          cta={t('common:actions.more')}
          icon={WsdmTokenIcon}
          onClick={trackClick('wsdm_token_menu')}
        />
        <PageCard
          to="/account/exchange-accounts"
          title={t('menu.account-manager.title')}
          description={t('menu.account-manager.subtitle')}
          cta={t('common:actions.more')}
          icon={ExternalAccountIcon}
          onClick={trackClick('external_account_menu')}
          badge={`${exchanges?.length || 0} ${t(
            'accounts:page-accounts.accounts-connected',
          )}`}
        />
        <PageCard
          to="/account/notification-center"
          title={t('menu.notification-center.title')}
          description={t('menu.notification-center.subtitle')}
          cta={t('common:actions.more')}
          icon={NotificationsIcon}
          onClick={trackClick('notifications_menu')}
        />
        <PageCard
          to="/account/referral"
          title={t('menu.referral.title')}
          description={t('menu.referral.subtitle')}
          cta={t('common:actions.invite')}
          icon={ReferralIcon}
          onClick={trackClick('referral_menu')}
          badge={`${referral?.referred_users_count || 0} ${t(
            'accounts:page-accounts.users-invited',
          )}`}
        />
      </div>
    </PageWrapper>
  );
};

export default PageAccount;
