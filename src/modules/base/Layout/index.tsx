import { clsx } from 'clsx';
import { useDiscoveryUrlParams } from 'modules/discovery/lib';
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
  const urlParams = useDiscoveryUrlParams();

  // Check if we're on a detail page (e.g., /token/slug, /whale/slug, /wallet/slug)
  // Uses route params instead of manual pathname parsing for robustness
  const isDetailPage = !!urlParams.detail;
  const isListPage = !!urlParams.list;
  // Both detail and list pages should have fixed viewport with sticky footer
  const isFixedViewport = isDetailPage || isListPage;

  return (
    <div
      className={clsx(
        'relative flex min-h-screen max-w-full flex-col bg-v1-surface-l0',
        // Lock scroll on mobile for both detail and list pages for fixed footer
        isFixedViewport && 'max-md:h-screen max-md:overflow-hidden',
      )}
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

      <div
        className={clsx(
          'flex items-start justify-start',
          // Grow on both detail and list pages to push footer to bottom
          'grow',
          // Critical for mobile flexbox scrolling on both detail and list pages
          isFixedViewport && 'max-md:min-h-0 max-md:flex-1',
        )}
      >
        {/* Main content */}
        <main
          className={clsx(
            'w-full max-w-full p-3',
            // Grow on both detail and list pages to push footer to bottom
            isFixedViewport && 'grow',
            // Critical for mobile flexbox scrolling on both detail and list pages
            isFixedViewport && 'max-md:min-h-0 max-md:flex-1',
            mainClassName,
          )}
        >
          <AuthorizedContent>{children}</AuthorizedContent>
        </main>
      </div>

      {/* Footer - sticky on both detail and list pages for consistent fixed positioning */}
      {footer !== null && (
        <footer
          className={clsx(
            'scrollbar-none z-50 h-(--footer-height) w-full overflow-hidden border-t border-t-white/10 empty:hidden',
            // Sticky on both detail and list pages for fixed footer behavior
            isFixedViewport && 'sticky bottom-0',
          )}
        >
          {footer || <Footer className="h-full" />}
        </footer>
      )}

      {/* Scroll helper */}
      <ScrollToTop />
    </div>
  );
};

export default Layout;
