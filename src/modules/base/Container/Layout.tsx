import { clsx } from 'clsx';
import React, { useRef, useState, type PropsWithChildren } from 'react';
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
  const mainRef = useRef<HTMLDivElement>(null);
  const [sideMenuCollapsed, setSideMenuCollapsed] = useState(false);
  const { PageSiblings, height, showSiblings, setShowSiblings } =
    usePageSiblings();

  return (
    <main
      className="relative mx-auto max-w-[2304px] bg-v1-surface-l1"
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
        ref={mainRef}
        id="scrolling-element"
        className={clsx(
          'ml-[--side-menu-width] mt-20 h-[calc(100vh-5rem)] overflow-auto p-6 pb-24 pt-0 mobile:mb-16 mobile:ml-0 mobile:h-auto mobile:p-3',
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
