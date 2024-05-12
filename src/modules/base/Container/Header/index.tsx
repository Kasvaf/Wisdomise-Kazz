import { clsx } from 'clsx';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { MAIN_LANDING, RouterBaseName } from 'config/constants';
import Logo from 'assets/logo-horizontal-beta.svg';
import useIsMobile from 'utils/useIsMobile';
import BranchSelector from './BranchSelector';
import LanguageSelector from './LanguageSelector';
import WalletDropdown from './WalletDropdown';
import ProfileMenu from './ProfileMenu';
import Breadcrumb from './Breadcrumb';
import OnBoardingMessageButton from './OnBoardingMessageButton';

interface Props {
  className?: string;
}

const Header: React.FC<Props> = ({ className }) => {
  const isMobile = useIsMobile();
  const { i18n } = useTranslation();

  return (
    <div
      className={clsx(
        'fixed top-0 z-20 mx-auto w-full max-w-screen-2xl',
        className,
      )}
    >
      <div
        className={clsx(
          'flex h-20 items-center justify-end bg-page p-6 pl-[260px] mobile:justify-between mobile:px-4 mobile:py-3',
        )}
      >
        {isMobile ? (
          <>
            <a href={MAIN_LANDING(i18n.language)}>
              <img src={Logo} />
            </a>
            {RouterBaseName && <BranchSelector />}
          </>
        ) : (
          <>
            <Breadcrumb className="pl-6" />
            <div className="grow" />
            {RouterBaseName && <BranchSelector />}
            <OnBoardingMessageButton />
            <LanguageSelector />
            <WalletDropdown />
          </>
        )}
        <ProfileMenu />
      </div>
    </div>
  );
};

export default Header;
