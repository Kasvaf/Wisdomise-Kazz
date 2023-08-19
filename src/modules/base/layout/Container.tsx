import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Header } from './header/Header';
import { MobileMenu } from './mobileMenu/MobileMenu';
import { SideMenu } from './sideMenu/SideMenu';

export const Container = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);
  const location = useLocation();

  useEffect(() => {
    mainRef.current?.addEventListener('scroll', function () {
      setShowShadow(this.scrollTop > 8);
    });
    document.addEventListener('scroll', function () {
      setShowShadow((this.scrollingElement?.scrollTop || 0) > 8);
    });
  }, []);

  return (
    <main className="mx-auto max-w-screen-2xl">
      <SideMenu />
      <Header showShadow={showShadow} />
      <div
        ref={mainRef}
        className="main ml-[17.75rem] mt-20 h-[calc(100vh-5rem)] overflow-auto p-6 pt-0 mobile:mb-16 mobile:ml-0 mobile:h-auto"
      >
        <TransitionGroup component={null}>
          <CSSTransition
            key={location.pathname}
            classNames="slide"
            timeout={300}
          >
            <Outlet />
          </CSSTransition>
        </TransitionGroup>
      </div>
      <MobileMenu />
    </main>
  );
};
