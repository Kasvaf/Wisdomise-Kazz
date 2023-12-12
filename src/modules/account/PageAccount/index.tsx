import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import CardPageLink from 'modules/shared/CardPageLink';
import {
  useExchangeAccountsQuery,
  useIsVerified,
  useReferralStatusQuery,
  useSubscription,
} from 'api';
import { ReactComponent as IconProfile } from './icons/profile.svg';
import { ReactComponent as IconSubscription } from './icons/subscription.svg';
import { ReactComponent as IconKYC } from './icons/kyc.svg';
import { ReactComponent as IconWSDM } from './icons/wsdm-token.svg';
import { ReactComponent as IconEA } from './icons/external-account.svg';
import { ReactComponent as IconNotifications } from './icons/notifications.svg';
import { ReactComponent as IconReferral } from './icons/referral.svg';

const PageAccount = () => {
  const { t } = useTranslation('base');
  const subscription = useSubscription();
  const { verifiedCount } = useIsVerified();
  const { data: exchanges } = useExchangeAccountsQuery();
  const { data: referral } = useReferralStatusQuery();

  return (
    <PageWrapper>
      <div className="mb-6 mobile:text-center">
        <h1 className="mb-3 text-3xl mobile:text-2xl">Account</h1>
        <p className="text-base text-white/80 mobile:text-xs">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-3 items-stretch gap-6 mobile:grid-cols-2">
        <CardPageLink
          to="/account/profile"
          title={t('menu.profile.title')}
          subtitle="Edit login credentials."
          icon={<IconProfile />}
        />
        <CardPageLink
          to="/account/billing"
          title={t('menu.billing.title')}
          subtitle="Subscription preferences."
          icon={<IconSubscription />}
        >
          <div className="flex flex-wrap items-end gap-x-2">
            <div className="text-2xl font-medium leading-6 mobile:text-xl">
              {subscription.title}
            </div>
            <div
              className={clsx(
                'text-xs',
                subscription.remaining ? 'text-[#34A3DA]' : 'text-error',
              )}
            >
              {subscription.remaining}d remains
            </div>
          </div>
        </CardPageLink>
        <CardPageLink
          to="/account/kyc"
          title={t('menu.kyc.title')}
          subtitle="Verify identity to access features."
          icon={<IconKYC />}
        >
          <div className="flex flex-wrap items-end gap-x-2">
            <div className="text-2xl font-medium leading-6 mobile:text-xl">
              {verifiedCount}/3
            </div>
            <div
              className={clsx(
                'text-xs',
                verifiedCount === 3 ? 'text-success' : 'text-[#F1AA40]',
              )}
            >
              Completed
            </div>
          </div>
        </CardPageLink>
        <CardPageLink
          to="/account/token"
          title={t('menu.token.title')}
          subtitle="Use tokens for premium access."
          icon={<IconWSDM />}
        />
        <CardPageLink
          to="/account/exchange-accounts"
          title={t('menu.account-manager.title')}
          subtitle="Integrate exchange accounts."
          icon={<IconEA />}
        >
          {exchanges != null && (
            <div className="flex flex-wrap items-end gap-x-2">
              <div className="text-2xl font-medium leading-6 mobile:text-xl">
                {exchanges?.length}
              </div>
              <div className="text-xs">Accounts</div>
            </div>
          )}
        </CardPageLink>
        <CardPageLink
          to="/account/notification-center"
          title={t('menu.notification-center.title')}
          subtitle="Signal and alert settings."
          icon={<IconNotifications />}
        />
        <CardPageLink
          to="/account/referral"
          title={t('menu.referral.title')}
          subtitle="Invite and earn rewards."
          icon={<IconReferral />}
        >
          {referral != null && (
            <div className="flex flex-wrap items-end gap-x-2">
              <div className="text-2xl font-medium leading-6 mobile:text-xl">
                {referral?.referred_users_count}
              </div>
              <div className="text-xs">Invited</div>
            </div>
          )}
        </CardPageLink>
      </div>
    </PageWrapper>
  );
};

export default PageAccount;
