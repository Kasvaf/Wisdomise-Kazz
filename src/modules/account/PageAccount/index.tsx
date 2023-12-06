import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import CardPageLink from 'modules/shared/CardPageLink';
import { ReactComponent as IconProfile } from './icons/profile.svg';
import { ReactComponent as IconSubscription } from './icons/subscription.svg';
import { ReactComponent as IconKYC } from './icons/kyc.svg';
import { ReactComponent as IconWSDM } from './icons/wsdm-token.svg';
import { ReactComponent as IconEA } from './icons/external-account.svg';
import { ReactComponent as IconNotifications } from './icons/notifications.svg';
import { ReactComponent as IconReferral } from './icons/referral.svg';

const PageAccount = () => {
  const { t } = useTranslation('base');

  return (
    <PageWrapper>
      <h1 className="mb-3 text-3xl">Account</h1>
      <p className="mb-6 text-base text-white/80">
        Manage your account settings and preferences
      </p>

      <div className="group/container grid grid-cols-3 items-stretch gap-6 mobile:grid-cols-1">
        <CardPageLink
          to="/account/profile"
          title={t('menu.profile.title')}
          subtitle="Edit login credentials."
          icon={<IconProfile className="absolute right-0 top-0" />}
        />
        <CardPageLink
          to="/account/billing"
          title={t('menu.billing.title')}
          subtitle="Subscription preferences."
          icon={<IconSubscription className="absolute right-0 top-0" />}
        />
        <CardPageLink
          to="/account/kyc"
          title={t('menu.kyc.title')}
          subtitle="Verify identity to access features."
          icon={<IconKYC className="absolute right-0 top-0" />}
        />
        <CardPageLink
          to="/account/token"
          title={t('menu.token.title')}
          subtitle="Use tokens for premium access."
          icon={<IconWSDM className="absolute right-0 top-0" />}
        />
        <CardPageLink
          to="/account/exchange-accounts"
          title={t('menu.account-manager.title')}
          subtitle="Integrate exchange accounts."
          icon={<IconEA className="absolute right-0 top-0" />}
        />
        <CardPageLink
          to="/account/notification-center"
          title={t('menu.notification-center.title')}
          subtitle="Signal and alert settings."
          icon={<IconNotifications className="absolute right-0 top-0" />}
        />
        <CardPageLink
          to="/account/referral"
          title={t('menu.referral.title')}
          subtitle="Invite and earn rewards."
          icon={<IconReferral className="absolute right-0 top-0" />}
        />
      </div>
    </PageWrapper>
  );
};

export default PageAccount;
