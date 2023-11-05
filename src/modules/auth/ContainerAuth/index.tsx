import type React from 'react';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from 'assets/logo-horizontal-beta.svg';
import useIsMobile from 'utils/useIsMobile';
import { logout } from 'modules/auth/authHandlers';
import bgMobile from './bg-mobile.png';
import bgDesktop from './bg.png';
import TelegramBanner from './TelegramBanner/TelegramBanner';

const ContainerAuth: React.FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation('auth');
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        backgroundImage: `url('${isMobile ? bgMobile : bgDesktop}')`,
      }}
      className="min-h-screen w-full bg-cover bg-no-repeat text-white"
    >
      <div className="m-auto flex min-h-screen max-w-[1300px] flex-col justify-between">
        <div>
          <header className="mb-10 mt-8 flex items-center justify-between px-8">
            <div className="w-44">
              <img src={Logo} alt="wisdomise_wealth_logo" />
            </div>

            <button
              onClick={logout}
              className="rounded-full border border-solid border-[#ffffff4d] px-5 py-3 text-sm md:px-8 md:py-3"
            >
              {t('base:user.logout')}
            </button>
          </header>

          {children}
        </div>

        <footer className="mb-20 pb-4 text-center text-base text-white/60">
          {t('footer')}
        </footer>

        <TelegramBanner />
      </div>
    </div>
  );
};

export default ContainerAuth;
