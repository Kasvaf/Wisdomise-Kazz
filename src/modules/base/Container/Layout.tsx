import { clsx } from 'clsx';
import React, { useState, type PropsWithChildren } from 'react';
import useIsMobile from 'utils/useIsMobile';
import { useHubSpot } from 'config/hubSpot';
import AuthorizedContent from '../auth/AuthorizedContent';
import PageWrapper from '../PageWrapper';
import Header from './Header';
import SideMenu from './SideMenu';
import ScrollToTop from './ScrollToTop';
import BottomNavBar from './BottomNavBar';
import { usePageSiblings } from './Header/Breadcrumb';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  useHubSpot();
  const isMobile = useIsMobile();
  const [sideMenuCollapsed, setSideMenuCollapsed] = useState(false);
  const { PageSiblings, height, showSiblings, setShowSiblings } =
    usePageSiblings();

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

      <Header showSiblings={showSiblings} onShowSiblings={setShowSiblings}>
        {isMobile && PageSiblings}
      </Header>

      <div
        className={clsx(
          'ml-[--side-menu-width] p-6',
          'mobile:ml-0 mobile:px-4 mobile:py-0',
          'mt-20 mobile:mb-[7rem] mobile:mt-16',
        )}
      >
        <div style={{ height }} />
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
