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
    <main className="relative bg-page">
      <OnboardingMessageProvider>
        <div className="fixed end-0 start-0 top-0 z-10 flex items-center justify-between bg-page p-4">
          <img src={Logo} alt="logo" />
          <TonConnectButton />
        </div>
        <div
          ref={mainRef}
          id="scrolling-element"
          className="my-16 ml-0 h-auto overflow-auto p-4 !pb-24"
        >
          <React.Suspense fallback={<PageWrapper loading />}>
            <Outlet />
          </React.Suspense>
        </div>
        <BottomNavBar className="!block" />
        <ScrollToTop />
      </OnboardingMessageProvider>
    </main>
  );
}
