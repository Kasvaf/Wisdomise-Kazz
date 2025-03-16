import { clsx } from 'clsx';
import React, { useState, type PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import useIsMobile from 'utils/useIsMobile';
import { useHubSpot } from 'config/hubSpot';
import { GlobalSearchBar } from 'shared/GlobalSearchBar';
import AuthorizedContent from '../auth/AuthorizedContent';
import PageWrapper from '../PageWrapper';
import Header from './Header';
import SideMenu from './SideMenu';
import ScrollToTop from './ScrollToTop';
import BottomNavBar from './BottomNavBar';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  useHubSpot();
  const isMobile = useIsMobile();
  const [sideMenuCollapsed, setSideMenuCollapsed] = useState(false);
  const { pathname } = useLocation();

  return (
    <main
      className="relative mx-auto h-auto max-w-[2304px] bg-v1-surface-l1"
      style={{
        ['--side-menu-width' as any]: `${sideMenuCollapsed ? 74 : 260}px`,
      }}
    >
      {!isMobile && (
        <SideMenu
          collapsed={sideMenuCollapsed}
          onCollapseClick={() => setSideMenuCollapsed(c => !c)}
        />
      )}

      <Header>
        {pathname.startsWith('/coin-radar') && !isMobile && (
          <GlobalSearchBar size="xl" className="w-full max-w-96 shrink-0" />
        )}
      </Header>

      <div
        className={clsx(
          'ml-[--side-menu-width] p-6',
          'mobile:ml-0 mobile:px-4 mobile:py-0',
          'mt-20 mobile:mb-[7rem] mobile:mt-16',
        )}
      >
        {pathname.startsWith('/coin-radar') && isMobile && (
          <GlobalSearchBar size="md" className="mb-4 w-full pt-px" />
        )}
        <React.Suspense fallback={<PageWrapper loading />}>
          <AuthorizedContent>{children}</AuthorizedContent>
        </React.Suspense>
      </div>

      <BottomNavBar />
      <ScrollToTop />
    </main>
  );
};

export default Layout;
