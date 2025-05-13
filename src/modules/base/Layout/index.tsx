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
    <div
      className="relative flex min-h-screen max-w-full flex-col bg-v1-surface-l1"
      style={{
        ['--desktop-sidebar-width' as never]:
          !isMobile && sidebar !== null ? '4.25rem' : 0,
        ['--desktop-header-height' as never]: isMobile ? 0 : '3rem',
        ['--route-details-height' as never]: isMobile ? 0 : '1.75rem',
      }}
    >
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 h-[--desktop-header-height] w-full mobile:h-auto">
        {header === null
          ? null
          : header || (
              <Header hasBack={hasBack} title={title} extension={extension} />
            )}
      </header>

      {/* Route details - only for desktop */}
      {!isMobile && (
        <RouteDetails
          hasBack={hasBack}
          className="fixed end-0 start-[--desktop-sidebar-width] top-[--desktop-header-height] z-20 w-auto"
        />
      )}

      <div className="flex grow items-start justify-start">
        {/* Sidebar - only for desktop */}
        {!isMobile && sidebar !== null && (
          <aside
            id="sidebar"
            className="sticky start-0 top-[--desktop-header-height] z-20 h-[calc(100svh-var(--desktop-header-height))] w-[--desktop-sidebar-width] shrink-0 overflow-auto border-r border-t border-white/10 bg-v1-surface-l2 scrollbar-none"
          >
            {sidebar || <DefaultSidebar />}
          </aside>
        )}

        {/* Main content */}
        <main
          className={clsx(
            'mt-[--route-details-height] w-[calc(100vw-var(--desktop-sidebar-width))] max-w-full grow p-3',
            mainClassName,
          )}
        >
          <AuthorizedContent>{children}</AuthorizedContent>
        </main>
      </div>

      {/* Sticky footer - only for mobile */}
      {isMobile && footer !== null && (
        <footer className="sticky inset-y-0 z-50 w-full overflow-auto scrollbar-none empty:hidden">
          {footer || <DefaultFooter />}
        </footer>
      )}

      {/* Scroll helper */}
      <ScrollToTop />
    </div>
  );
};

export default Layout;
