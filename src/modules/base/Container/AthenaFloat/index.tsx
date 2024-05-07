import { clsx } from 'clsx';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import PageAthena from 'modules/athena/PageAthena';
import { useHasFlag } from 'api';
import { useAthenaFloat } from './AthenaFloatProvider';

export default function AthenaFloat() {
  const ctx = useAthenaFloat();
  const isOpen = ctx.isOpen;
  const toggleOpen = ctx.toggleOpen;
  const { pathname } = useLocation();
  const prePathname = useRef<string | null>(null);
  const hasFlag = useHasFlag();

  useEffect(() => {
    if (prePathname.current && pathname !== prePathname.current && isOpen) {
      toggleOpen?.();
    }
    prePathname.current = pathname;
  }, [isOpen, pathname, toggleOpen]);

  if (!hasFlag('/?athena-float')) return null;
  return (
    <div
      className={clsx(
        'absolute bottom-0 left-1/2 z-40 h-[90vh] w-[calc(100%-30px)] max-w-[1500px] -translate-x-1/2 rounded-3xl rounded-b-none backdrop-blur-2xl',
        'invisible overflow-auto opacity-0 transition-all duration-500',
        'mobile:fixed mobile:top-0 mobile:h-[calc(100dvh-4rem)] mobile:w-full mobile:overflow-auto mobile:rounded-none max-md:pb-8',
        'bg-[linear-gradient(235deg,#61529866_13.43%,#42427b66_77.09%)]',
        isOpen && '!visible opacity-100',
      )}
    >
      <PageAthena isFloat />
    </div>
  );
}
