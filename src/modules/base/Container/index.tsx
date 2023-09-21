import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { clsx } from 'clsx';
import { useSubscription } from 'api';
import useIsMobile from 'utils/useIsMobile';
import AuthGuard from 'modules/auth/AuthGuard';
import Header from './Header';
import SideMenu from './SideMenu';
import MobileMenu from './MobileMenu';
import TrialBanner from './TrialBanner';

const Container = () => {
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

  const isMobile = useIsMobile();
  const { hasSubscription, isTrialing, hasStripe } = useSubscription();
  const hasBanner = (!hasSubscription || isTrialing || !hasStripe) && !isMobile;
  const topOffsetClass = hasBanner ? 'top-14' : 'top-0';

  return (
    <AuthGuard>
      <main className="mx-auto max-w-screen-2xl">
        {hasBanner && <TrialBanner />}
        <SideMenu className={topOffsetClass} />
        <Header showShadow={showShadow} className={topOffsetClass} />
        <div
          ref={mainRef}
          className={clsx(
            'ml-[17.75rem] mt-20 h-[calc(100vh-5rem)] overflow-auto p-6 mobile:mb-16 mobile:ml-0 mobile:h-auto',
            hasBanner ? 'pt-14' : 'pt-0',
          )}
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
    </AuthGuard>
  );
};

export default Container;
