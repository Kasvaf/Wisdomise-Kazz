import React, { useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { clsx } from 'clsx';
import AuthGuard from 'modules/auth/AuthGuard';
import PageWrapper from '../PageWrapper';
import Header from './Header';
import SideMenu from './SideMenu';
import BottomNavBar from './BottomNavBar';

const Container = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <AuthGuard>
      <main className="mx-auto max-w-screen-2xl bg-page">
        <SideMenu />
        <Header />
        <div
          ref={mainRef}
          className={clsx(
            'ml-[16.25rem] mt-20 h-[calc(100vh-5rem)] overflow-auto p-6 pt-0 mobile:mb-16 mobile:ml-0 mobile:h-auto',
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
        <BottomNavBar />
      </main>
    </AuthGuard>
  );
};

export default Container;
