import { clsx } from 'clsx';
import { ATHENA_TELEGRAM_BOT } from 'config/constants';
import telegramIcon from './telegram.svg';
import cloudsLeftImg from './clouds-left.svg';
import cloudsRightImg from './clouds-right.svg';

const clouds = clsx(
  'absolute hidden h-[162px] w-[504px] bg-contain bg-no-repeat md:block',
);
export default function TelegramBanner() {
  return (
    <a
      href={ATHENA_TELEGRAM_BOT}
      target="_blank"
      referrerPolicy="no-referrer"
      className="fixed inset-x-0 bottom-0 flex h-[72px] w-full justify-center bg-[#0b6492] text-white"
      rel="noreferrer noopener"
    >
      <div
        className={clsx(clouds, 'left-[-5.5rem]')}
        style={{
          backgroundImage: `url("${cloudsLeftImg}")`,
        }}
      />
      <div className="flex shrink-0 items-center gap-1 text-sm sm:gap-2 md:gap-4 md:text-base">
        <img
          src={telegramIcon}
          width={36}
          height={36}
          alt="Telegram"
          className="h-[2.25rem]"
        />
        Athena Telegram Bot
        <div className="rounded-full bg-white/30 p-3">Stay Connected</div>
      </div>
      <div
        className={clsx(clouds, 'right-[-5.5rem]')}
        style={{
          backgroundImage: `url("${cloudsRightImg}")`,
        }}
      />
    </a>
  );
}
