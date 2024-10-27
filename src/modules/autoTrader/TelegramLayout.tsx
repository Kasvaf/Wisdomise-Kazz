import { clsx } from 'clsx';
import React, { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { TonConnectButton } from '@tonconnect/ui-react';
import OnboardingMessageProvider from 'shared/Onboarding/OnboardingMessageProvider';
import PageWrapper from 'modules/base/PageWrapper';
import BottomNavBar from 'modules/base/Container/BottomNavBar';
import ScrollToTop from 'modules/base/Container/ScrollToTop';
import Logo from 'assets/logo-horizontal-beta.svg';

export function TelegramLayout() {
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <main
      className="relative mx-auto max-w-[2304px] bg-page"
      style={{
        ['--side-menu-width' as any]: '260px',
      }}
    >
      <OnboardingMessageProvider>
        <div className="fixed end-0 start-0 top-0 z-10 flex items-center justify-between bg-page p-4">
          <img src={Logo} />
          <TonConnectButton />
        </div>
        <div
          ref={mainRef}
          id="scrolling-element"
          className={clsx(
            'mt-16 h-[calc(100vh-5rem)] overflow-auto p-6 !pb-24 pt-0 mobile:mb-16 mobile:ml-0 mobile:h-auto mobile:p-4',
          )}
        >
          <React.Suspense fallback={<PageWrapper loading />}>
            <Outlet />
          </React.Suspense>
        </div>
        <BottomNavBar />
        <ScrollToTop />
      </OnboardingMessageProvider>
    </main>
  );
}
