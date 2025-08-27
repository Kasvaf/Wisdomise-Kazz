import { clsx } from 'clsx';
import type React from 'react';
import type { PropsWithChildren, ReactElement } from 'react';
import useIsMobile from 'utils/useIsMobile';
import AuthorizedContent from '../auth/AuthorizedContent';
import DefaultFooter from './DefaultFooter';
import DefaultSidebar from './DefaultSidebar';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import ScrollToTop from './ScrollToTop';

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
  // useHubSpot();
  const isMobile = useIsMobile();
  const Header = isMobile ? MobileHeader : DesktopHeader;

  return (
    <div
      className="relative flex min-h-screen max-w-full flex-col bg-v1-surface-l0"
      style={{
        ['--desktop-sidebar-width' as never]:
          !isMobile && sidebar !== null ? '4rem' : '0px',
        ['--desktop-header-height' as never]: isMobile ? '0px' : '3rem',
        ['--route-details-height' as never]: isMobile
          ? '0px'
          : '0px' /* '1.75rem' */,
        ['--desktop-content-height' as never]:
          'calc(100svh - var(--desktop-header-height) - 1.5rem)',
        ['--desktop-content-top' as never]:
          'calc(var(--desktop-header-height) + var(--route-details-height))',
      }}
    >
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 h-(--desktop-header-height) mobile:h-auto w-full max-w-full">
        {header === null
          ? null
          : header || (
              <Header extension={extension} hasBack={hasBack} title={title} />
            )}
      </header>

      <div id="cio-inline-banner" />

      {/* Route details - only for desktop */}
      {/* {!isMobile && (
        <RouteDetails
          hasBack={hasBack}
          className="sticky end-0 top-(--desktop-header-height) z-20 ms-(--desktop-sidebar-width) h-(--route-details-height) w-auto"
        />
      )} */}

      <div className="flex grow items-start justify-start">
        {/* Sidebar - only for desktop */}
        {!isMobile && sidebar !== null && (
          <aside
            className="-mt-(--route-details-height) scrollbar-none sticky start-0 top-(--desktop-header-height) z-20 h-[calc(100svh-var(--desktop-header-height))] w-(--desktop-sidebar-width) shrink-0 overflow-auto border-white/10 border-r bg-v1-surface-l0"
            // eslint-disable-next-line tailwindcss/enforces-negative-arbitrary-values
            id="sidebar"
          >
            {sidebar || <DefaultSidebar />}
          </aside>
        )}

        {/* Main content */}
        <main
          className={clsx(
            'w-[calc(100%-var(--desktop-sidebar-width))] max-w-[calc(100%-var(--desktop-sidebar-width))] grow p-3',
            mainClassName,
          )}
        >
          <AuthorizedContent>{children}</AuthorizedContent>
        </main>
      </div>

      {/* Sticky footer - only for mobile */}
      {isMobile && footer !== null && (
        <footer className="scrollbar-none sticky inset-y-0 z-50 w-full overflow-auto empty:hidden">
          {footer || <DefaultFooter />}
        </footer>
      )}

      {/* Scroll helper */}
      <ScrollToTop />
    </div>
  );
};

export default Layout;
