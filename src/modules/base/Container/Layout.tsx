import { clsx } from 'clsx';
import React, { useRef, useState, type PropsWithChildren } from 'react';
import useIsMobile from 'utils/useIsMobile';
import AuthorizedContent from '../auth/AuthorizedContent';
import PageWrapper from '../PageWrapper';
import Header from './Header';
import SideMenu from './SideMenu';
import ScrollToTop from './ScrollToTop';
import BottomNavBar from './BottomNavBar';
import { usePageSiblings } from './Header/Breadcrumb';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
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
          ' overflow-auto',
          'ml-[--side-menu-width] h-[calc(100svh-5rem)] p-6',
          'mobile:ml-0 mobile:h-[calc(100svh-4rem)] mobile:px-3 mobile:pb-[6.5rem] mobile:pt-0',
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
