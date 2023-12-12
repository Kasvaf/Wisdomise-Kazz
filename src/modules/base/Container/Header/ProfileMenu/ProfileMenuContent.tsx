import { Crisp } from 'crisp-sdk-web';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  useAccountQuery,
  useIsVerified,
  useReferralStatusQuery,
  useSubscription,
} from 'api';
import Button from 'modules/shared/Button';
import useIsMobile from 'utils/useIsMobile';
import { ReactComponent as AccountIconEmpty } from '../../useMenuItems/icons/account-empty.svg';
import LanguageSelector from '../LanguageSelector';
import { ReactComponent as SignOutIcon } from './signout.svg';
import { ReactComponent as QuestionRectIcon } from './question-rect.svg';

const openCrisp = () => Crisp.chat.open();

const ProfileMenuContent = () => {
  const { t } = useTranslation('base');
  const subscription = useSubscription();
  const { data: account } = useAccountQuery();
  const { data: referral } = useReferralStatusQuery();
  const { verifiedCount } = useIsVerified();
  const isMobile = useIsMobile();

  return (
    <div className="text-white">
      <div className="flex items-center justify-center gap-3 p-3 text-center">
        <AccountIconEmpty className="h-6 w-6 shrink-0" />
        {account?.email}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl bg-white/[.02]">
        {isMobile && <LanguageSelector />}
        <NavLink
          to="/account/billing"
          className="flex h-16 items-center justify-between border-b border-b-black/10 p-3 hover:bg-black/40"
        >
          <div className="text-white/80">{t('menu.billing.title')}</div>
          <div className="text-right">
            <div className="text-[#34A3DA]">{subscription.title}</div>
            <div>
              <span
                className={clsx(subscription.remaining ? '' : 'text-error')}
              >
                {String(subscription.remaining) + 'd'}
              </span>
              <span className="text-white/40"> Remains</span>
            </div>
          </div>
        </NavLink>

        <NavLink
          to="/account/kyc"
          className="flex h-16 items-center justify-between border-b border-b-black/10 p-3 hover:bg-black/40"
        >
          <div className="text-white/80">KYC</div>
          <div className="text-right">
            <div
              className={clsx(
                'text-base font-medium leading-6',
                verifiedCount === 3 ? 'text-success' : 'text-[#F1AA40]',
              )}
            >
              {verifiedCount}/3
            </div>
          </div>
        </NavLink>

        <NavLink
          to="/account/referral"
          className="flex h-16 items-center justify-between p-3 hover:bg-black/40"
        >
          <div className="text-white/80">{t('menu.referral.title')}</div>
          <div className="text-right">
            {referral != null && (
              <div className="flex flex-wrap items-center gap-x-2">
                <div className="text-base font-medium leading-6 text-white">
                  {referral?.referred_users_count}
                </div>
                <div className="text-xs text-white/40">Invited</div>
              </div>
            )}
          </div>
        </NavLink>
      </div>

      <Button
        className="my-4 block w-full !border-error hover:!border-error/70"
        contentClassName="text-error gap-3"
        variant="secondary"
        to="/auth/logout"
      >
        <SignOutIcon />
        Sign Out
      </Button>

      <Button className="my-4 block w-full" variant="link" onClick={openCrisp}>
        <QuestionRectIcon />
        <span className="ml-3 mr-2">Question?</span>
        <span className="text-xs font-normal text-white/40">Chat with us</span>
      </Button>

      <div className="border-b border-b-white/5" />

      <NavLink
        className="block w-full p-4 hover:text-warning"
        target="_blank"
        to="https://wisdomise.medium.com/"
      >
        Blog
      </NavLink>
      <NavLink
        className="block w-full p-4 hover:text-warning"
        target="_blank"
        to="https://landing.wisdomise.com/about-us/"
      >
        About Us
      </NavLink>
    </div>
  );
};

export default ProfileMenuContent;
