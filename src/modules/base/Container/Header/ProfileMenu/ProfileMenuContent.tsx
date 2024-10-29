import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bxChevronRight, bxLinkExternal } from 'boxicons-quasar';
import { type PropsWithChildren } from 'react';
import { useAccountQuery, useSubscription, useReferralStatusQuery } from 'api';
import { useLogoutMutation } from 'api/auth';
import { openHubSpot } from 'config/hubSpot';
import Icon from 'shared/Icon';
import Button from 'shared/Button';
import useIsMobile from 'utils/useIsMobile';
import { MAIN_LANDING } from 'config/constants';
import LanguageSelector from '../LanguageSelector';
import WalletDropdownContent from '../WalletDropdown/WalletDropdownContent';
import { ReactComponent as AccountIconEmpty } from '../../useMenuItems/icons/account-empty.svg';
import { ReactComponent as QuestionRectIcon } from './question-rect.svg';
import { ReactComponent as SignOutIcon } from './signout.svg';

const WithChevron: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="flex items-center">
    {children}
    <Icon name={bxChevronRight} className="ml-2 text-white/10" />
  </div>
);

const ReferralSection = () => {
  const { t } = useTranslation('base');
  const { data: referral } = useReferralStatusQuery();
  return (
    <NavLink
      to="/account/referral"
      className="flex h-16 items-center justify-between p-3 hover:bg-black/40"
    >
      <div className="text-white/80">{t('menu.referral.title')}</div>
      <WithChevron>
        <div className="text-right">
          {referral != null && (
            <div className="flex flex-wrap items-center gap-x-2">
              <div className="text-base font-medium leading-6 text-white">
                {referral?.referred_users_count}
              </div>
              <div className="text-xs text-white/40">
                {t('auth:page-referral.invited')}
              </div>
            </div>
          )}
        </div>
      </WithChevron>
    </NavLink>
  );
};

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
          className="flex h-10 w-full items-center gap-2 px-4 font-normal text-white/60 hover:text-warning"
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
  const { t, i18n } = useTranslation('base');
  const subscription = useSubscription();
  const { data: account } = useAccountQuery();
  const isMobile = useIsMobile();
  const { mutateAsync, isLoading: loggingOut } = useLogoutMutation();

  return (
    <div className="text-white">
      <div className="flex items-center justify-center gap-3 p-3 text-center">
        <AccountIconEmpty className="h-6 w-6 shrink-0" />
        {account?.email}
      </div>

      {isMobile && (
        <div className="mt-4 overflow-hidden rounded-xl bg-black/30">
          <WalletDropdownContent />
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-xl bg-black/30">
        {isMobile && (
          <LanguageSelector>
            <div className="flex h-16 items-center justify-between border-b border-b-black/10 p-3 hover:bg-black/40">
              <div className="text-white/80">{t('language')}</div>
              <WithChevron>
                <div className="text-right">{i18n.language.toUpperCase()}</div>
              </WithChevron>
            </div>
          </LanguageSelector>
        )}
        <NavLink
          to="/account/billing"
          className="flex h-16 items-center justify-between border-b border-b-black/10 p-3 hover:bg-black/40"
        >
          <div className="text-white/80">{t('menu.billing.title')}</div>
          <WithChevron>
            <div className="text-right">
              <div className="text-[#34A3DA]">
                {subscription.levelType === 'pro'
                  ? t('pro:pro')
                  : t('pro:trial')}
              </div>
              {
                <div>
                  <span
                    className={clsx(
                      subscription.remaining ? 'text-white' : 'text-error',
                    )}
                  >
                    {String(subscription.remaining) + 'd'}
                  </span>
                  <span className="ml-1 text-white/40">
                    {t('menu.billing.remains')}
                  </span>
                </div>
              }
            </div>
          </WithChevron>
        </NavLink>

        {!isMobile && <ReferralSection />}
      </div>

      <Button
        className="my-4 block w-full !border-error hover:!border-error/70"
        contentClassName="text-error gap-3"
        variant="secondary"
        to="/auth/logout"
        loading={loggingOut}
        onClick={e => {
          e.preventDefault();
          void mutateAsync({});
        }}
      >
        <SignOutIcon />
        {t('user.sign-out')}
      </Button>

      <Button
        className="my-4 block w-full"
        variant="link"
        onClick={openHubSpot}
      >
        <QuestionRectIcon />
        <span className="ml-3 mr-2">{t('support.title')}</span>
        <span className="text-xs font-normal text-white/40">
          {t('support.hint')}
        </span>
      </Button>

      <div className="mb-4 border-b border-b-white/5" />
      <ExternalLinks />
    </div>
  );
};

export default ProfileMenuContent;
