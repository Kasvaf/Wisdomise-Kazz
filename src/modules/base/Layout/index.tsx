import { clsx } from 'clsx';
import type React from 'react';
import { type ReactElement, type PropsWithChildren } from 'react';
import useIsMobile from 'utils/useIsMobile';
import { useHubSpot } from 'config/hubSpot';
import AuthorizedContent from '../auth/AuthorizedContent';
import ScrollToTop from './ScrollToTop';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';
import DefaultSidebar from './DefaultSidebar';
import DefaultFooter from './DefaultFooter';
import RouteDetails from './RouteDetails';

export interface LayoutProps {
  hasBack?: boolean;
  title?: null | string;
  mobileRight?: null | false | ReactElement;
  extension?: null | false | ReactElement;
  header?: false | null | ReactElement;
  footer?: false | null | ReactElement;
  sidebar?: false | null | ReactElement;
  mainClassName?: string;
}

const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  hasBack,
  title,
  extension,
  header,
  footer,
  sidebar,
  mainClassName,
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

      <div className="flex max-w-full grow items-stretch justify-start overflow-x-hidden">
        <aside className="sticky left-0 top-12 z-50 h-[calc(100svh-3rem)] empty:hidden">
          {sidebar === null || isMobile ? null : sidebar || <DefaultSidebar />}
        </aside>

        <div className="flex grow flex-col">
          {!isMobile && <RouteDetails hasBack={hasBack} />}
          <main className={clsx('grow p-3 mobile:ml-0', mainClassName)}>
            <AuthorizedContent>{children}</AuthorizedContent>
          </main>
        </div>
      </div>

      <footer className="sticky bottom-0 z-50 w-full empty:hidden">
        {footer === null || !isMobile ? null : footer || <DefaultFooter />}
      </footer>

      <ScrollToTop />
    </div>
  );
};

export default Layout;
