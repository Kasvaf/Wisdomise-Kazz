import type React from 'react';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from 'assets/logo-horizontal-beta.svg';
import useIsMobile from 'utils/useIsMobile';
import { logout } from 'modules/auth/authHandlers';
import LanguageSelector from 'modules/base/Container/Header/LanguageSelector';
import Button from 'shared/Button';
import bgMobile from './bg-mobile.png';
import bgDesktop from './bg.png';

const ContainerAuth: React.FC<PropsWithChildren> = ({ children }) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('auth');

  return (
    <div
      style={{
        backgroundImage: `url('${isMobile ? bgMobile : bgDesktop}')`,
      }}
      className="min-h-screen w-full bg-cover bg-no-repeat text-white"
    >
      <div className="m-auto flex min-h-screen max-w-[1300px] flex-col justify-between">
        <header className="mb-10 mt-4 flex items-center justify-between px-4 sm:mt-8 sm:px-8">
          <div className="w-36">
            <img src={Logo} alt="wisdomise_wealth_logo" />
          </div>

          <div className="flex items-center">
            <LanguageSelector />
            <Button
              variant="alternative"
              className="!px-3 md:!px-8"
              onClick={logout}
            >
              {t('base:user.logout')}
            </Button>
          </div>
        </header>

        <div className="flex grow items-center justify-center">{children}</div>

        <footer className="pb-2 text-center text-base text-white/60">
          {t('footer')}
        </footer>
      </div>
    </div>
  );
};

export default ContainerAuth;
