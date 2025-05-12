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
      className="relative flex min-h-screen flex-col bg-v1-surface-l1"
      style={{
        ['--desktop-sidebar-width' as never]:
          !isMobile && sidebar !== null ? '4.25rem' : 0,
        ['--desktop-header-height' as never]: isMobile ? 0 : '3rem',
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

      {/* Main content wrapper with sidebar and main area */}
      <div className="flex grow overflow-hidden">
        {/* Sidebar - only for desktop */}
        {!isMobile && sidebar !== null && (
          <aside className="fixed top-[--desktop-header-height] z-20 h-[calc(100svh-var(--desktop-header-height))] w-[--desktop-sidebar-width] overflow-auto border-r border-t border-white/10 bg-v1-surface-l2 scrollbar-none">
            {sidebar || <DefaultSidebar />}
          </aside>
        )}

        {/* Content area */}
        <div className="ms-[--desktop-sidebar-width] flex max-w-full grow flex-col overflow-hidden">
          {/* Route details - only for desktop */}
          {!isMobile && (
            <RouteDetails
              hasBack={hasBack}
              className="fixed top-[--desktop-header-height] z-20 w-full"
            />
          )}

          {/* Main dynamic content */}
          <main className={clsx('mt-7 grow overflow-auto p-3', mainClassName)}>
            <AuthorizedContent>{children}</AuthorizedContent>
          </main>
        </div>
      </div>

      {/* Sticky footer - only for mobile */}
      {isMobile && footer !== null && (
        <footer className="sticky bottom-0 z-20 w-full empty:hidden">
          {footer || <DefaultFooter />}
        </footer>
      )}

      {/* Scroll helper */}
      <ScrollToTop />
    </div>
  );
};

export default Layout;
