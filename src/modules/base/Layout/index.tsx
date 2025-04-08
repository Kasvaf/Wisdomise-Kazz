import React, { type ReactElement, type PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import useIsMobile from 'utils/useIsMobile';
import { useHubSpot } from 'config/hubSpot';
import { GlobalSearchBar } from 'shared/GlobalSearchBar';
import Spinner from 'shared/Spinner';
import AuthorizedContent from '../auth/AuthorizedContent';
import ScrollToTop from './ScrollToTop';
import BottomNavBar from './BottomNavBar';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';

const Layout: React.FC<
  PropsWithChildren<{
    header?: false | null | ReactElement;
    footer?: false | null | ReactElement;
  }>
> = ({ header, footer, children }) => {
  useHubSpot();
  const isMobile = useIsMobile();
  const { pathname } = useLocation();

  const Header = isMobile ? MobileHeader : DesktopHeader;
  return (
    <div className="relative flex min-h-screen flex-col bg-v1-surface-l1">
      <header className="sticky top-0 z-20 w-full">
        {header === null || header === false
          ? null
          : header || (
              <Header
                extension={
                  pathname.startsWith('/coin-radar') &&
                  !isMobile && (
                    <GlobalSearchBar
                      size="xs"
                      className="w-full max-w-96 shrink-0"
                      selectorSurface={isMobile ? 2 : 3}
                      buttonSurface={isMobile ? 1 : 2}
                    />
                  )
                }
              />
            )}
      </header>

      <main className="grow p-6 mobile:ml-0 mobile:px-4 mobile:py-0">
        {pathname.startsWith('/coin-radar') && isMobile && (
          <GlobalSearchBar size="md" className="mb-4 w-full pt-px" />
        )}
        <React.Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center text-white mobile:h-[calc(100vh-10rem)]">
              <Spinner />
            </div>
          }
        >
          <AuthorizedContent>{children}</AuthorizedContent>
        </React.Suspense>
      </main>

      <footer className="sticky bottom-0 z-50 w-full">
        {footer === null || footer === false || !isMobile
          ? null
          : footer || <BottomNavBar />}
      </footer>

      <ScrollToTop />
    </div>
  );
};

export default Layout;
