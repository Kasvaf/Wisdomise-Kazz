import type React from 'react';
import { type PropsWithChildren } from 'react';
import Logo from 'assets/logo-horizontal-wealth.svg';
import useIsMobile from 'utils/useIsMobile';
import { logout } from 'modules/auth/authHandlers';
import bgMobile from './bg-mobile.png';
import bgDesktop from './bg.png';

const ContainerAuth: React.FC<PropsWithChildren> = ({ children }) => {
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
              className="rounded-full border border-solid border-[#ffffff4d] px-5 py-3 text-xs md:px-8 md:py-3"
            >
              Log Out
            </button>
          </header>

          {children}
        </div>

        <footer className="pb-4 text-center text-xs text-[#ffffffcc] ">
          Version alpha 1.0.0 © 2023 Wisdomise. All rights reserved
        </footer>
      </div>
    </div>
  );
};

export default ContainerAuth;
