import { clsx } from 'clsx';
import { useHasFlag } from 'api';
import athenaIcon from 'assets/athena.mp4';
import { ReactComponent as Background } from './assets/desktop-icon-bg.svg';
import { useAthenaFloat } from './AthenaFloatProvider';

export default function AthenaFloatDesktopIcon() {
  const ctx = useAthenaFloat();
  const hasFlag = useHasFlag();

  if (!hasFlag('/?athena-float')) return null;
  return (
    <>
      <div
        onClick={ctx.toggleOpen}
        className="absolute bottom-0 left-1/2 z-50 -translate-x-1/2 cursor-pointer max-md:hidden"
      >
        <Background />
        <div
          className={clsx(
            'absolute left-1/2 top-4 size-14 -translate-x-1/2 rounded-full p-6 shadow-[0_0_10px_#615298]',
            ctx.isOpen && 'rounded-full border-[5px] border-[#7D6EB6]',
          )}
        >
          <video
            muted
            loop
            autoPlay
            playsInline
            style={{ clipPath: 'circle(48% at 50% 50%)' }}
            className={clsx(
              'absolute left-0 top-0 z-10 scale-105 overflow-hidden object-cover',
            )}
          >
            <source src={athenaIcon} />
          </video>
        </div>
      </div>
    </>
  );
}
