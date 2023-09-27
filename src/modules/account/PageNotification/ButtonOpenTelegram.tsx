import { clsx } from 'clsx';
import { useCallback } from 'react';
import { bxlTelegram } from 'boxicons-quasar';
import { useAccountQuery } from 'api';
import { ATHENA_TELEGRAM_BOT } from 'config/constants';
import useIsMobile from 'utils/useIsMobile';
import useConfirm from 'shared/useConfirm';
import Button from 'shared/Button';
import Icon from 'shared/Icon';

const TelegramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('mr-2 rounded-full p-2', className)}>
    <Icon name={bxlTelegram} />
  </div>
);

export default function ButtonOpenTelegram() {
  const isMobile = useIsMobile();
  const account = useAccountQuery();

  const [Modal, openModal] = useConfirm({
    icon: <TelegramIcon className="bg-white text-black/70" />,
    yesTitle: account.data?.telegram_id ? 'Open Telegram' : 'Connect Telegram',
    message: (
      <div>
        <h1 className="text-white">Go to Telegram</h1>
        <p className="text-slate-400">
          Go to telegram and use{' '}
          <code className="rounded bg-gray-700 px-2 py-1 text-cyan-400">
            /subscribe_to_signals
          </code>{' '}
          command.
        </p>
      </div>
    ),
  });

  const clickHandler = useCallback(async () => {
    if (!account.data?.telegram_id && !(await openModal())) return;
    window.open(ATHENA_TELEGRAM_BOT, '_blank');
  }, [account.data?.telegram_id, openModal]);

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-4 md:flex-row',
        isMobile && 'mb-10 rounded-3xl bg-white/5 p-6',
      )}
    >
      <div className="text-sm sm:hidden lg:block">
        Receive notification in socials
      </div>
      <div>
        <Button
          onClick={clickHandler}
          className="!py-1 !pl-1 pr-3"
          size="small"
        >
          <TelegramIcon className="bg-black text-white" />
          Open Telegram
        </Button>
      </div>
      {Modal}
    </div>
  );
}
