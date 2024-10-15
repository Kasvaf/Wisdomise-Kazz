import React, { useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { clsx } from 'clsx';
import OnboardingMessageProvider from 'shared/Onboarding/OnboardingMessageProvider';
import useIsMobile from 'utils/useIsMobile';
import AuthorizedContent from '../auth/AuthorizedContent';
import PageWrapper from '../PageWrapper';
import AuthGuard from '../auth/AuthGuard';
import Header from './Header';
import SideMenu from './SideMenu';
import BottomNavBar from './BottomNavBar';
import { AthenaFloatProvider } from './AthenaFloat/AthenaFloatProvider';
import AthenaFloat from './AthenaFloat';
import ScrollToTop from './ScrollToTop';
import { usePageSiblings } from './Header/Breadcrumb';
import { GeneralMeta } from './GeneralMeta';

const Container = () => {
  const isMobile = useIsMobile();
  const mainRef = useRef<HTMLDivElement>(null);
  const [sideMenuCollapsed, setSideMenuCollapsed] = useState(false);
  const { PageSiblings, height, showSiblings, setShowSiblings } =
    usePageSiblings();

  return (
    <AuthGuard>
      <GeneralMeta />
      <AthenaFloatProvider>
        <main
          className="relative mx-auto max-w-[2304px] bg-page"
          style={{
            ['--side-menu-width' as any]: `${sideMenuCollapsed ? 74 : 260}px`,
          }}
        >
          <OnboardingMessageProvider>
            <SideMenu
              collapsed={sideMenuCollapsed}
              onCollapseClick={() => setSideMenuCollapsed(c => !c)}
              className="mobile:hidden"
            />
            <Header
              showSiblings={showSiblings}
              onShowSiblings={setShowSiblings}
            >
              {isMobile && PageSiblings}
            </Header>
            <div
              ref={mainRef}
              id="scrolling-element"
              className={clsx(
                'ml-[--side-menu-width] mt-20 h-[calc(100vh-5rem)] overflow-auto p-6 pb-24 pt-0 mobile:mb-16 mobile:ml-0 mobile:h-auto',
              )}
            >
              <div style={{ height }} />
              <React.Suspense fallback={<PageWrapper loading />}>
                <AuthorizedContent>
                  <Outlet />
                </AuthorizedContent>
              </React.Suspense>
            </div>
            <AthenaFloat />
            <BottomNavBar />
            <ScrollToTop />
          </OnboardingMessageProvider>
        </main>
      </AthenaFloatProvider>
    </AuthGuard>
  );
};

export default Container;
