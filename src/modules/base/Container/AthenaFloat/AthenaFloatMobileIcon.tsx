import { clsx } from 'clsx';
import { useHasFlag } from 'api';
import athenaIcon from 'assets/athena.mp4';
import background from './assets/mobile-icon-bg.svg';
import { useAthenaFloat } from './AthenaFloatProvider';

export default function AthenaFloatMobileIcon() {
  const ctx = useAthenaFloat();
  const hasFlag = useHasFlag();

  if (!hasFlag('/?athena-float')) return null;
  return (
    <>
      <div
        onClick={ctx?.toggleOpen}
        className="absolute left-1/2 top-[-54%] w-36 -translate-x-1/2 cursor-pointer"
      >
        <img src={background} className="absolute w-full" />
        <div
          className={clsx(
            'absolute left-1/2 top-4 size-14 -translate-x-1/2 rounded-full shadow-[0_0_20px_#615298]',
            ctx.isOpen && 'rounded-full border-[5px] border-[#7D6EB6]',
          )}
        >
          <video
            muted
            loop
            autoPlay
            playsInline
            className="scale-105 overflow-hidden object-cover"
            style={{ clipPath: 'circle(48% at 50% 50%)' }}
          >
            <source src={athenaIcon} />
          </video>
        </div>
      </div>
    </>
  );
}
