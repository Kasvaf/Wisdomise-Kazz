import {
  useExchangeAccountsQuery,
  useReferralStatusQuery,
  useSubscription,
} from 'api';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import { PageCard } from 'shared/PageCard';
import { PageTitle } from 'shared/PageTitle';
import { ReadableDuration } from 'shared/ReadableDuration';
import { Badge } from 'shared/v1-components/Badge';
import useIsMobile from 'utils/useIsMobile';
import { isMiniApp } from 'utils/version';
import BtnLiveSupport from './BtnLiveSupport';
import {
  ExternalAccountIcon,
  ProfileIcon,
  ReferralIcon,
  RewardIcon,
  SubscriptionIcon,
  UserIcon,
  WsdmTokenIcon,
} from './icons';

const PageAccount: FC = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('base');
  const subscription = useSubscription();
  const { data: exchanges } = useExchangeAccountsQuery();
  const { data: referral } = useReferralStatusQuery();

  return (
    <PageWrapper
      extension={!isMobile && <CoinExtensionsGroup />}
      hasBack
      title="My Account"
    >
      <PageTitle
        className="mb-10 mobile:hidden"
        description={t('menu.account.subtitle')}
        icon={UserIcon}
        title={t('menu.account.title')}
      />

      <div className="grid grid-cols-2 mobile:grid-cols-1 gap-4 mobile:gap-2 xl:grid-cols-3">
        <PageCard
          description={t('menu.profile.subtitle')}
          icon={ProfileIcon}
          onClick={trackClick('profile_menu')}
          title={t('menu.profile.title')}
          to="/account/profile"
        />
        {!isMiniApp && (
          <PageCard
            badge={
              subscription.group !== 'free' && (
                <Badge>
                  <span className="flex items-center gap-1">
                    <ReadableDuration
                      value={subscription.remaining}
                      zeroText={t('pro:zero-hour')}
                    />{' '}
                    {t('menu.billing.remains')}
                  </span>
                </Badge>
              )
            }
            description={t('menu.billing.subtitle')}
            icon={SubscriptionIcon}
            onClick={trackClick('subscription_menu')}
            title={t('menu.billing.title')}
            to="/account/billing"
          />
        )}
        {!isMiniApp && (
          <PageCard
            description={t('menu.token.subtitle')}
            icon={WsdmTokenIcon}
            onClick={trackClick('wsdm_token_menu')}
            title={t('menu.token.title')}
            to="/account/token"
          />
        )}
        <PageCard
          badge={
            <Badge>
              {t('accounts:page-accounts.accounts_connected', {
                count: exchanges?.length || 0,
              })}
            </Badge>
          }
          description={t('menu.account-manager.subtitle')}
          icon={ExternalAccountIcon}
          onClick={trackClick('external_account_menu')}
          title={t('menu.account-manager.title')}
          to="/account/exchange-accounts"
        />
        <PageCard
          badge={
            <Badge>
              {t('accounts:page-accounts.users_invited', {
                count: referral?.referred_users_count || 0,
              })}
            </Badge>
          }
          description={t('menu.referral.subtitle')}
          icon={ReferralIcon}
          onClick={trackClick('referral_menu')}
          title={t('menu.referral.title')}
          to="/account/referral"
        />
        {isMiniApp && (
          <PageCard
            description={t('menu.game-rewards.subtitle')}
            icon={RewardIcon}
            onClick={trackClick('game_rewards_menu')}
            title={t('menu.game-rewards.title')}
            to="/trader/claim-reward"
          />
        )}
        <PageCard
          description={t('menu.rewards.subtitle')}
          icon={RewardIcon}
          onClick={trackClick('rewards_menu')}
          title={t('menu.rewards.title')}
          to="/account/rewards"
        />
      </div>
      <BtnLiveSupport />
    </PageWrapper>
  );
};

export default PageAccount;
