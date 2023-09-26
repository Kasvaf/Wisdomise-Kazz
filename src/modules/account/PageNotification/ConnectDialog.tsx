import { ATHENA_TELEGRAM_BOT } from 'config/constants';
import Button from 'modules/shared/Button';
import { ReactComponent as Telegram } from '@/assets/images/telegram-glowing.svg';

export default function ConnectDialog() {
  return (
    <div className="my-8 flex flex-col items-center text-center md:p-12">
      <Telegram className="mb-4" />
      <h1 className="text-white">Go to Telegram</h1>
      <p className="text-slate-400">
        Go to telegram and use{' '}
        <code className="rounded bg-gray-700 px-2 py-1 text-cyan-400">
          /subscribe_to_signals
        </code>{' '}
        command.
      </p>
      <Button
        className="mt-5 !w-72 max-w-full"
        to={ATHENA_TELEGRAM_BOT}
        target="_blank"
      >
        Open Telegram
      </Button>
    </div>
  );
}
