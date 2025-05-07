import { useTranslation } from 'react-i18next';
import { type FC } from 'react';
import PageWrapper from 'modules/base/PageWrapper';
import {
  useExchangeAccountsQuery,
  useReferralStatusQuery,
  useSubscription,
} from 'api';
import { trackClick } from 'config/segment';
import { PageCard } from 'shared/PageCard';
import { ReadableDuration } from 'shared/ReadableDuration';
import Badge from 'shared/Badge';
import { isMiniApp } from 'utils/version';
import { PageTitle } from 'shared/PageTitle';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useIsMobile from 'utils/useIsMobile';
import BtnLiveSupport from './BtnLiveSupport';
import {
  ProfileIcon,
  WsdmTokenIcon,
  ExternalAccountIcon,
  ReferralIcon,
  RewardIcon,
  UserIcon,
  SubscriptionIcon,
} from './icons';

const PageAccount: FC = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('base');
  const subscription = useSubscription();
  const { data: exchanges } = useExchangeAccountsQuery();
  const { data: referral } = useReferralStatusQuery();

  return (
    <PageWrapper
      hasBack
      title="My Account"
      extension={!isMobile && <CoinExtensionsGroup />}
    >
      <PageTitle
        className="mb-10 mobile:hidden"
        icon={UserIcon}
        title={t('menu.account.title')}
        description={t('menu.account.subtitle')}
      />

      <div className="grid grid-cols-2 gap-4 mobile:grid-cols-1 mobile:gap-2 xl:grid-cols-3">
        <PageCard
          to="/account/profile"
          title={t('menu.profile.title')}
          description={t('menu.profile.subtitle')}
          icon={ProfileIcon}
          onClick={trackClick('profile_menu')}
        />
        {!isMiniApp && (
          <PageCard
            to="/account/billing"
            title={t('menu.billing.title')}
            description={t('menu.billing.subtitle')}
            icon={SubscriptionIcon}
            onClick={trackClick('subscription_menu')}
            badge={
              subscription.level !== 0 && (
                <Badge
                  color={subscription.remaining ? 'white' : 'red'}
                  label={
                    <span className="flex items-center gap-1">
                      <ReadableDuration
                        value={subscription.remaining}
                        zeroText={t('pro:zero-hour')}
                      />{' '}
                      {t('menu.billing.remains')}
                    </span>
                  }
                />
              )
            }
          />
        )}
        {!isMiniApp && (
          <PageCard
            to="/account/token"
            title={t('menu.token.title')}
            description={t('menu.token.subtitle')}
            icon={WsdmTokenIcon}
            onClick={trackClick('wsdm_token_menu')}
          />
        )}
        <PageCard
          to="/account/exchange-accounts"
          title={t('menu.account-manager.title')}
          description={t('menu.account-manager.subtitle')}
          icon={ExternalAccountIcon}
          onClick={trackClick('external_account_menu')}
          badge={
            <Badge
              color="blue"
              label={`${exchanges?.length || 0} ${t(
                'accounts:page-accounts.accounts-connected',
              )}`}
            />
          }
        />
        <PageCard
          to="/account/referral"
          title={t('menu.referral.title')}
          description={t('menu.referral.subtitle')}
          icon={ReferralIcon}
          onClick={trackClick('referral_menu')}
          badge={
            <Badge
              color="blue"
              label={`"${referral?.referred_users_count || 0}" ${t(
                'accounts:page-accounts.users-invited',
              )}`}
            />
          }
        />
        {isMiniApp && (
          <PageCard
            to="/trader/claim-reward"
            title={t('menu.game-rewards.title')}
            description={t('menu.game-rewards.subtitle')}
            icon={RewardIcon}
            onClick={trackClick('game_rewards_menu')}
          />
        )}
        <PageCard
          to="/account/rewards"
          title={t('menu.rewards.title')}
          description={t('menu.rewards.subtitle')}
          icon={RewardIcon}
          onClick={trackClick('rewards_menu')}
        />
      </div>
      <BtnLiveSupport />
    </PageWrapper>
  );
};

export default PageAccount;
