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
import box from './box.png';
import blurBg from './blur.png';
import './animation.css';

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
      <div className="relative mr-2 rounded-lg bg-wsdm-gradient p-px">
        <div className="relative">
          {profile?.photo_url ? (
            <img
              src={profile?.photo_url}
              className="size-[40px] rounded-lg"
              alt=""
            />
          ) : (
            <div className="flex size-[40px] items-center justify-center rounded-lg bg-v1-surface-l3">
              {(profile?.first_name ?? profile.username)[0].toUpperCase()}
            </div>
          )}
        </div>
        <img
          src={blurBg}
          className="absolute -bottom-10 -right-10 h-20 min-w-20"
          alt=""
        />
        <img
          src={box}
          alt="box"
          className="absolute -bottom-5 -right-5"
          style={{ animation: '2s shake infinite' }}
        />
      </div>

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
        <div className="fixed end-0 start-0 top-0 z-10 flex w-screen items-center justify-between bg-page p-4">
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
