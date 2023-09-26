import { bxlTelegram } from 'boxicons-quasar';
import { ATHENA_TELEGRAM_BOT } from 'config/constants';
import Button from 'shared/Button';
import Icon from 'shared/Icon';

export default function TelegramConnectedDialog() {
  return (
    <div className="my-8 flex flex-col items-center text-center md:p-12">
      <h1 className="text-white">Account connected successfully</h1>
      <p className="text-slate-400">
        Your Telegram account is now synced
        <br />
        you can go back to Telegram.
      </p>
      <Button
        className="mt-5 !w-72 max-w-full"
        to={ATHENA_TELEGRAM_BOT}
        target="_blank"
      >
        <Icon name={bxlTelegram} />
        Open Telegram
      </Button>
    </div>
  );
}
