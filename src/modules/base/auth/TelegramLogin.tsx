import { clsx } from 'clsx';
import type React from 'react';
import { useHasFlag } from 'api/feature-flags';
import { TelegramIcon } from 'modules/account/PageProfile/assets';

const TelegramLogin: React.FC<{ onClick: () => unknown }> = ({ onClick }) => {
  const hasFlag = useHasFlag();
  if (!hasFlag('/mini-login')) return null;

  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex w-[200px] items-center justify-center gap-2',
        'rounded-[4px] bg-v1-background-brand text-sm hover:bg-v1-background-brand-hover',
        'px-3 py-2',
      )}
    >
      <TelegramIcon />
      Login By Telegram
    </button>
  );
};

export default TelegramLogin;
