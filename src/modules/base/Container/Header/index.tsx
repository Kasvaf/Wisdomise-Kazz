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

interface Props {
  className?: string;
}

const Header: React.FC<Props> = ({ className }) => {
  const { i18n } = useTranslation();
  const isMobile = useIsMobile();
  return (
    <div
      className={clsx('fixed z-20 mx-auto w-full max-w-screen-2xl', className)}
    >
      <div
        className={clsx(
          'flex h-20 items-center justify-end bg-page p-6 mobile:justify-between mobile:px-4 mobile:py-3',
        )}
      >
        {isMobile && (
          <a href={MAIN_LANDING(i18n.language)}>
            <img src={Logo} />
          </a>
        )}
        {RouterBaseName && <BranchSelector />}

        {!isMobile && (
          <>
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
