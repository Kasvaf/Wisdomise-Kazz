import React, { useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { clsx } from 'clsx';
import AuthGuard from 'modules/auth/AuthGuard';
import OnboardingMessageProvider from 'shared/Onboarding/OnboardingMessageProvider';
import PageWrapper from '../PageWrapper';
import Header from './Header';
import SideMenu from './SideMenu';
import BottomNavBar from './BottomNavBar';
import { AthenaFloatProvider } from './AthenaFloat/AthenaFloatProvider';
import AthenaFloat from './AthenaFloat';
import AthenaFloatDesktopIcon from './AthenaFloat/AthenaFloatDesktopIcon';
import ScrollToTop from './ScrollToTop';

const Container = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [sideMenuCollapsed, setSideMenuCollapsed] = useState(false);

  return (
    <AuthGuard>
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
            <Header />
            <div
              ref={mainRef}
              className={clsx(
                'ml-[--side-menu-width] mt-20 h-[calc(100vh-5rem)] overflow-auto p-6 pb-24 pt-0 mobile:mb-16 mobile:ml-0 mobile:h-auto',
              )}
            >
              <React.Suspense fallback={<PageWrapper loading />}>
                <Outlet />
              </React.Suspense>
            </div>
            <AthenaFloat />
            <BottomNavBar />
            <AthenaFloatDesktopIcon />
            <ScrollToTop />
          </OnboardingMessageProvider>
        </main>
      </AthenaFloatProvider>
    </AuthGuard>
  );
};

export default Container;
