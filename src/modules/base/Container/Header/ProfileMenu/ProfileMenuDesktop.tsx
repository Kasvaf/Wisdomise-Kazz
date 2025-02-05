import { type FC, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bxLinkExternal } from 'boxicons-quasar';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { useAccountQuery, useSubscription, useReferralStatusQuery } from 'api';
import { useLogoutMutation } from 'api/auth';
import { openHubSpot } from 'config/hubSpot';
import Icon from 'shared/Icon';
import { MAIN_LANDING } from 'config/constants';
import { ReadableDuration } from 'shared/ReadableDuration';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as AccountIconEmpty } from '../../useMenuItems/icons/account-empty.svg';
import { ReactComponent as QuestionRectIcon } from './question-rect.svg';
import { ReactComponent as SignOutIcon } from './signout.svg';

const ExternalLinks = () => {
  const { t, i18n } = useTranslation('base');
  const items = [
    { label: t('links.blog'), link: 'https://wisdomise.medium.com/' },
    {
      label: t('links.about-us'),
      link: MAIN_LANDING(i18n.language) + '/about-us/',
    },
  ];

  return (
    <>
      {items.map(item => (
        <NavLink
          key={item.link}
          className="flex w-full items-center gap-2 px-4 font-normal text-v1-content-primary hover:text-v1-content-notice"
          target="_blank"
          to={item.link}
        >
          {item.label}
          <Icon size={12} name={bxLinkExternal} />
        </NavLink>
      ))}
    </>
  );
};

const ProfileMenuContent = () => {
  const { t } = useTranslation('base');
  const subscription = useSubscription();
  const { data: account } = useAccountQuery();
  const { data: referral } = useReferralStatusQuery();
  const { mutateAsync, isLoading: loggingOut } = useLogoutMutation();

  return (
    <div className="min-w-80 space-y-4 text-v1-content-primary">
      <div className="flex items-center justify-center gap-2 text-ellipsis p-3 text-center text-base">
        <AccountIconEmpty className="size-6 shrink-0" />
        {account?.email}
      </div>

      <div className="divide-y divide-white/5 overflow-hidden rounded-xl bg-white/5">
        <NavLink
          to="/account/billing"
          className="flex h-14 items-center justify-between p-3 transition-all hover:bg-v1-background-brand/5"
        >
          <div className="text-v1-content-primary">
            {t('billing:common.subscription')}
          </div>
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
        </NavLink>
        <NavLink
          to="/account/referral"
          className="flex h-14 items-center justify-between p-3 transition-all hover:bg-v1-background-brand/5"
        >
          <div className="text-v1-content-primary">
            {t('menu.referral.title')}
          </div>
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
        </NavLink>
      </div>
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

      <button
        className="flex w-full items-center justify-center"
        onClick={openHubSpot}
      >
        <QuestionRectIcon />
        <span className="ml-3 mr-2">{t('support.title')}</span>
        <span className="text-xs font-normal text-white/40">
          {t('support.hint')}
        </span>
      </button>

      <div className="border-b border-b-white/5" />
      <ExternalLinks />
    </div>
  );
};

export const ProfileMenuTooltip: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <ClickableTooltip
      chevron={false}
      title={<ProfileMenuContent />}
      tooltipPlacement="bottomLeft"
    >
      {children}
    </ClickableTooltip>
  );
};
