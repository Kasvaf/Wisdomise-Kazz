import React, { type ReactElement, type PropsWithChildren } from 'react';
import useIsMobile from 'utils/useIsMobile';
import { useHubSpot } from 'config/hubSpot';
import Spinner from 'shared/Spinner';
import AuthorizedContent from '../auth/AuthorizedContent';
import BottomNavBar from './BottomNavBar';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';

export interface LayoutProps {
  hasBack?: boolean;
  title?: null | string;
  mobileRight?: null | false | ReactElement;
  extension?: null | false | ReactElement;
  header?: false | null | ReactElement;
  footer?: false | null | ReactElement;
}

const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  hasBack,
  title,
  extension,
  header,
  footer,
  children,
}) => {
  useHubSpot();
  const isMobile = useIsMobile();
  const Header = isMobile ? MobileHeader : DesktopHeader;
  return (
    <div className="relative flex min-h-screen flex-col bg-v1-surface-l1">
      <header className="sticky top-0 z-20 w-full">
        {header === null
          ? null
          : header || (
              <Header hasBack={hasBack} title={title} extension={extension} />
            )}
      </header>

      <main className="grow p-3 mobile:ml-0">
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
        {footer === null || !isMobile ? null : footer || <BottomNavBar />}
      </footer>
    </div>
  );
};

export default Layout;
