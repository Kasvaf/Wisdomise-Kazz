import React, { useRef } from 'react';
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

const Container = () => {
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <AuthGuard>
      <AthenaFloatProvider>
        <main className="relative mx-auto max-w-screen-2xl bg-page">
          <OnboardingMessageProvider>
            <SideMenu />
            <Header />
            <div
              ref={mainRef}
              className={clsx(
                'ml-[16.25rem] mt-20 h-[calc(100vh-5rem)] overflow-auto p-6 pb-16 pt-0 mobile:mb-16 mobile:ml-0 mobile:h-auto',
              )}
            >
              <React.Suspense fallback={<PageWrapper loading />}>
                <Outlet />
              </React.Suspense>
            </div>
            <AthenaFloat />
            <BottomNavBar />
            <AthenaFloatDesktopIcon />
          </OnboardingMessageProvider>
        </main>
      </AthenaFloatProvider>
    </AuthGuard>
  );
};

export default Container;
