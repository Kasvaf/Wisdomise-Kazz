import { clsx } from 'clsx';
import ArrowSrc from './arrow.svg';

const AskAthena: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <a
      href="https://athena.wisdomise.io"
      target="_blank"
      rel="noreferrer"
      className={clsx(
        'flex h-16 cursor-pointer items-center justify-between rounded-3xl bg-white/5 px-8 py-3 text-xl text-white/20 mobile:p-2 mobile:pl-8 mobile:text-sm',
        className,
      )}
    >
      Ask Athena anything about crypto
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
        <img src={ArrowSrc} />
      </div>
    </a>
  );
};

export default AskAthena;
