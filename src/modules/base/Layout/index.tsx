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
        ['--header-height' as never]: '60px',
        ['--footer-height' as never]: isMobile ? '64px' : '44px',
        ['--content-height' as never]:
          'calc(100svh - var(--header-height) - var(--footer-height))',
      }}
    >
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 h-(--header-height) w-full max-w-full border-b border-b-white/10 max-md:h-auto">
        {header === null
          ? null
          : header || (
              <Header
                className="h-auto max-h-full"
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
        <footer className="scrollbar-none sticky inset-y-0 z-50 h-(--footer-height) w-full overflow-auto border-t border-t-white/10 empty:hidden">
          {footer || <Footer className="h-auto max-h-full" />}
        </footer>
      )}

      {/* Scroll helper */}
      <ScrollToTop />
    </div>
  );
};

export default Layout;
