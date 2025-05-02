import { clsx } from 'clsx';
import type React from 'react';
import { type ReactElement, type PropsWithChildren } from 'react';
import useIsMobile from 'utils/useIsMobile';
import { useHubSpot } from 'config/hubSpot';
import AuthorizedContent from '../auth/AuthorizedContent';
import ScrollToTop from './ScrollToTop';
import BottomNavBar from './BottomNavBar';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';
import { NetworkMenu } from './NetworkMenu';
import { AlertButton } from './AlertButton';
import { GlobalSearch } from './GlobalSearch';

export interface LayoutProps {
  hasBack?: boolean;
  title?: null | string;
  mobileRight?: null | false | ReactElement;
  extension?: null | false | ReactElement;
  header?: false | null | ReactElement;
  footer?: false | null | ReactElement;
  mainClassName?: string;
}

const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  hasBack,
  title,
  extension: userExtension,
  header,
  footer,
  mainClassName,
  children,
}) => {
  useHubSpot();
  const isMobile = useIsMobile();
  const Header = isMobile ? MobileHeader : DesktopHeader;
  const extension = (
    <>
      {userExtension}
      <div className="flex items-center gap-2">
        <GlobalSearch
          surface={isMobile ? 2 : 3}
          size={isMobile ? 'sm' : 'xs'}
          className="min-w-[122px] grow"
        />
        <NetworkMenu
          surface={isMobile ? 2 : 3}
          size={isMobile ? 'sm' : 'xs'}
          className="shrink-0"
        />
        <AlertButton
          surface={isMobile ? 1 : 2}
          size={isMobile ? 'sm' : 'xs'}
          className="ms-6 shrink-0 mobile:ms-0"
        />
      </div>
    </>
  );
  return (
    <div className="relative flex min-h-screen flex-col bg-v1-surface-l1">
      <header className="sticky top-0 z-20 w-full">
        {header === null
          ? null
          : header || (
              <Header hasBack={hasBack} title={title} extension={extension} />
            )}
      </header>

      <main className={clsx('grow p-3 mobile:ml-0', mainClassName)}>
        <AuthorizedContent>{children}</AuthorizedContent>
      </main>

      <footer className="sticky bottom-0 z-50 w-full">
        {footer === null || !isMobile ? null : footer || <BottomNavBar />}
      </footer>

      <ScrollToTop />
    </div>
  );
};

export default Layout;
