import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { useAccountQuery, useSubscription, useReferralStatusQuery } from 'api';
import { useLogoutMutation } from 'api/auth';
import { RouterBaseName } from 'config/constants';
import useIsMobile from 'utils/useIsMobile';
import { isMiniApp } from 'utils/version';
import { Button } from 'shared/v1-components/Button';
import { ReadableDuration } from 'shared/ReadableDuration';
import LanguageSelector from '../LanguageSelector';
import BranchSelector from '../BranchSelector';
import { ReactComponent as AccountIconEmpty } from '../../useMenuItems/icons/account-empty.svg';
import { ReactComponent as SignOutIcon } from './signout.svg';
import ExternalLinks from './ExternalLinks';
import Support from './Support';

const InternalItem: React.FC<
  PropsWithChildren<{ label: string; to: string }>
> = ({ label, to, children }) => {
  return (
    <NavLink
      to={to}
      className="flex h-14 items-center justify-between p-3 transition-all hover:bg-v1-background-brand/5"
    >
      <div className="text-v1-content-primary">{label}</div>
      {children}
    </NavLink>
  );
};

const ProfileMenuContent = () => {
  const { t } = useTranslation('base');
  const isMobile = useIsMobile();
  const subscription = useSubscription();
  const { data: account } = useAccountQuery();
  const { data: referral } = useReferralStatusQuery();
  const { mutateAsync, isLoading: loggingOut } = useLogoutMutation();
  const { pathname } = useLocation();

  return (
    <div className="min-w-80 space-y-4 text-v1-content-primary">
      <div className="flex max-w-full grow-0 justify-between overflow-hidden">
        <div className="flex items-center gap-2 overflow-hidden p-3 text-center text-base mobile:w-3/4 mobile:pl-1">
          <AccountIconEmpty className="size-6 shrink-0" />
          <div className="grow text-ellipsis text-left">{account?.email}</div>
        </div>

        {isMobile && (
          <div className="flex shrink-0 gap-2">
            {RouterBaseName && pathname !== '/menu' && <BranchSelector />}
            <LanguageSelector />
          </div>
        )}
      </div>

      <div className="divide-y divide-white/5 overflow-hidden rounded-xl bg-white/5">
        {isMobile && (
          <>
            <InternalItem to="/account/overview" label="My Account" />
            <InternalItem to="/coin-radar/alerts" label="Manage Alerts" />
          </>
        )}

        {!isMiniApp && (
          <InternalItem
            to="/account/billing"
            label={t('billing:common.subscription')}
          >
            <div className="text-end">
              <div className="capitalize text-v1-content-brand">
                {subscription.group.replace('_', ' ')}
              </div>
              <div className="text-xs capitalize">
                <span
                  className={clsx(
                    subscription.remaining
                      ? 'text-v1-content-primary'
                      : 'text-v1-content-negative',
                  )}
                >
                  <ReadableDuration
                    value={subscription.remaining}
                    zeroText={t('pro:zero-hour')}
                  />
                </span>
                <span className="ms-1 font-light capitalize text-v1-content-secondary">
                  {t('billing:common.remains')}
                </span>
              </div>
            </div>
          </InternalItem>
        )}
        <InternalItem to="/account/referral" label={t('menu.referral.title')}>
          <div className="text-end">
            {referral != null && (
              <div className="flex flex-wrap items-center gap-x-2">
                <div className="text-base font-medium text-v1-content-primary">
                  {referral?.referred_users_count}
                </div>
                <div className="text-xs font-light text-v1-content-secondary">
                  {t('auth:page-referral.invited')}
                </div>
              </div>
            )}
          </div>
        </InternalItem>
      </div>

      {!isMiniApp && (
        <Button
          block
          className="w-full"
          variant="negative"
          loading={loggingOut}
          onClick={e => {
            e.preventDefault();
            void mutateAsync({});
          }}
        >
          <SignOutIcon />
          {t('user.sign-out')}
        </Button>
      )}

      <Support />
      <div className="border-b border-b-white/5" />
      <ExternalLinks />
    </div>
  );
};

export default ProfileMenuContent;
