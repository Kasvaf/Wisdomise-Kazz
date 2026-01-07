import { clsx } from 'clsx';
import type React from 'react';
import type { PropsWithChildren, ReactElement } from 'react';
import useIsMobile from 'utils/useIsMobile';
import AuthorizedContent from '../auth/AuthorizedContent';
import { Footer } from './Footer';
import { Header } from './Header';
import ScrollToTop from './ScrollToTop';

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
  extension,
  header,
  footer,
  mainClassName,
  children,
}) => {
  // useHubSpot();
  const isMobile = useIsMobile();

  return (
    <div
      className="relative flex min-h-screen max-w-full flex-col bg-v1-surface-l0"
      style={{
        ['--desktop-header-height' as never]: isMobile ? '0px' : '3.75rem',
        ['--desktop-content-height' as never]:
          'calc(100svh - var(--desktop-header-height))',
      }}
    >
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 w-full max-w-full border-b border-b-white/10 max-md:h-auto">
        {header === null
          ? null
          : header || (
              <Header
                className="h-auto md:max-h-(--desktop-header-height)"
                extension={extension}
                hasBack={hasBack}
                title={title}
              />
            )}
      </header>

      <div id="cio-inline-banner" />

      <div className="flex grow items-start justify-start">
        {/* Main content */}
        <main className={clsx('w-full max-w-full grow p-3', mainClassName)}>
          <AuthorizedContent>{children}</AuthorizedContent>
        </main>
      </div>

      {/* Sticky footer */}
      {footer !== null && (
        <footer className="scrollbar-none sticky inset-y-0 z-50 w-full overflow-auto border-t border-t-white/10 empty:hidden">
          {footer || <Footer />}
        </footer>
      )}

      {/* Scroll helper */}
      <ScrollToTop />
    </div>
  );
};

export default Layout;
