import React, { useRef } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { TonConnectButton } from '@tonconnect/ui-react';
import OnboardingMessageProvider from 'shared/Onboarding/OnboardingMessageProvider';
import PageWrapper from 'modules/base/PageWrapper';
import BottomNavBar from 'modules/base/Container/BottomNavBar';
import ScrollToTop from 'modules/base/Container/ScrollToTop';
import Logo from 'assets/logo.png';
import { useTelegramProfile } from './TelegramProvider';
import FabSupport from './FabSupport';

const ProfileInfo = () => {
  const profile = useTelegramProfile();

  if (!profile?.username) {
    return <img src={Logo} className="h-8" alt="logo" />;
  }

  return (
    <NavLink
      className="flex max-w-[180px] items-center rounded-lg pr-4 hover:bg-black/20"
      to="/trader-claim-reward"
    >
      {profile?.photo_url ? (
        <img src={profile?.photo_url} className="mr-2 size-[40px] rounded-lg" />
      ) : (
        <div className="mr-2 flex size-[40px] items-center justify-center rounded-lg bg-v1-background-brand">
          {(profile?.first_name ?? profile.username)[0].toUpperCase()}
        </div>
      )}

      <div>
        <div className="text-sm">
          {profile?.first_name} {profile?.last_name}
        </div>
        <div className="text-xs text-v1-content-secondary">
          {profile.username}
        </div>
      </div>
    </NavLink>
  );
};

export default function TelegramLayout() {
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <main className="relative bg-page">
      <OnboardingMessageProvider>
        <div className="fixed end-0 start-0 top-0 z-10 flex items-center justify-between bg-page p-4">
          <ProfileInfo />
          <TonConnectButton />
        </div>
        <FabSupport />
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
