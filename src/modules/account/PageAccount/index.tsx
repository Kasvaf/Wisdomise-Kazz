import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import CardPageLink from 'shared/CardPageLink';
import {
  useExchangeAccountsQuery,
  useReferralStatusQuery,
  useSubscription,
} from 'api';
import { trackClick } from 'config/segment';
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
  const { data: exchanges } = useExchangeAccountsQuery();
  const { data: referral } = useReferralStatusQuery();

  return (
    <PageWrapper>
      <div className="mb-6 mobile:text-center">
        <h1 className="mb-3 text-3xl mobile:text-2xl">
          {t('menu.account.title')}
        </h1>
        <p className="text-base text-white/80 mobile:text-xs">
          {t('menu.account.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-3 items-stretch gap-6 mobile:grid-cols-2">
        <CardPageLink
          to="/account/profile"
          title={t('menu.profile.title')}
          subtitle={t('menu.profile.subtitle')}
          icon={<IconProfile />}
          onClick={trackClick('profile_menu')}
        />
        <CardPageLink
          to="/account/billing"
          title={t('menu.billing.title')}
          subtitle={t('menu.billing.subtitle')}
          icon={<IconSubscription />}
          onClick={trackClick('subscription_menu')}
        >
          <div className="flex flex-wrap items-end gap-x-2">
            <div className="text-2xl font-medium leading-6 mobile:text-xl">
              {subscription.title}
            </div>
            {!subscription.isFreePlan && (
              <div
                className={clsx(
                  'text-xs',
                  subscription.remaining ? 'text-[#34A3DA]' : 'text-error',
                )}
              >
                {String(subscription.remaining) + 'd'}{' '}
                {t('menu.billing.remains')}
              </div>
            )}
          </div>
        </CardPageLink>
        <CardPageLink
          to="/account/kyc"
          title={t('menu.kyc.title')}
          subtitle={t('menu.kyc.subtitle')}
          icon={<IconKYC />}
          onClick={trackClick('kyc_menu')}
        />
        <CardPageLink
          to="/account/token"
          title={t('menu.token.title')}
          subtitle={t('menu.token.subtitle')}
          icon={<IconWSDM />}
          onClick={trackClick('wsdm_token_menu')}
        />
        <CardPageLink
          to="/account/exchange-accounts"
          title={t('menu.account-manager.title')}
          subtitle={t('menu.account-manager.subtitle')}
          icon={<IconEA />}
          onClick={trackClick('external_account_menu')}
        >
          {exchanges != null && (
            <div className="flex flex-wrap items-end gap-x-2">
              <div className="text-2xl font-medium leading-6 mobile:text-xl">
                {exchanges?.length}
              </div>
              <div className="text-xs">
                {t('external-accounts:account.accounts')}
              </div>
            </div>
          )}
        </CardPageLink>
        <CardPageLink
          to="/account/notification-center"
          title={t('menu.notification-center.title')}
          subtitle={t('menu.notification-center.subtitle')}
          icon={<IconNotifications />}
          onClick={trackClick('notifications_menu')}
        />
        <CardPageLink
          to="/account/referral"
          title={t('menu.referral.title')}
          subtitle={t('menu.referral.subtitle')}
          icon={<IconReferral />}
          onClick={trackClick('referral_menu')}
        >
          {referral != null && (
            <div className="flex flex-wrap items-end gap-x-2">
              <div className="text-2xl font-medium leading-6 mobile:text-xl">
                {referral?.referred_users_count}
              </div>
              <div className="text-xs">{t('auth:page-referral.invited')}</div>
            </div>
          )}
        </CardPageLink>
      </div>
    </PageWrapper>
  );
};

export default PageAccount;
