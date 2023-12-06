import React, { useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { clsx } from 'clsx';
import { useSubscription } from 'api';
import useIsMobile from 'utils/useIsMobile';
import AuthGuard from 'modules/auth/AuthGuard';
import PageWrapper from '../PageWrapper';
import Header from './Header';
import SideMenu from './SideMenu';
import MobileMenu from './MobileMenu';
import TrialBanner from './TrialBanner';

const Container = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isTrialPlan } = useSubscription();
  const mainRef = useRef<HTMLDivElement>(null);

  const topOffsetClass = isTrialPlan
    ? isMobile
      ? 'top-[8rem]'
      : 'top-14'
    : 'top-0';

  return (
    <AuthGuard>
      <main className="mx-auto max-w-screen-2xl bg-page">
        <TrialBanner />
        <SideMenu className={topOffsetClass} />
        <Header className={topOffsetClass} />
        <div
          ref={mainRef}
          className={clsx(
            'ml-[17.75rem] mt-20 h-[calc(100vh-5rem)] overflow-auto p-6 mobile:mb-16 mobile:ml-0 mobile:h-auto',
            isTrialPlan ? (isMobile ? 'pt-[8rem]' : 'pt-14') : 'pt-0',
          )}
        >
          <TransitionGroup component={null}>
            <CSSTransition
              key={location.pathname}
              classNames="slide"
              timeout={300}
            >
              <React.Suspense fallback={<PageWrapper loading />}>
                <Outlet />
              </React.Suspense>
            </CSSTransition>
          </TransitionGroup>
        </div>
        <MobileMenu />
      </main>
    </AuthGuard>
  );
};

export default Container;
