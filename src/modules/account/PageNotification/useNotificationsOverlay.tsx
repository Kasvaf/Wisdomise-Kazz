import { bxLock } from 'boxicons-quasar';
import { useAccountQuery } from 'api';
import Button from 'modules/shared/Button';
import Card from 'modules/shared/Card';
import Icon from 'modules/shared/Icon';
import { ATHENA_TELEGRAM_BOT } from 'config/constants';
import TelegramIcon from './TelegramIcon';

const TelegramDisconnectedOverlay = () => (
  <Card className="mt-12 flex flex-col items-center !bg-[#343942] text-center">
    <div className="mb-4 rounded-full bg-white/10 p-4">
      <TelegramIcon className="bg-white text-black/70" />
    </div>

    <h1 className="text-white">Your Telegram is not connected</h1>
    <p className="mt-2 text-slate-400">
      Go to telegram and use{' '}
      <code className="rounded bg-gray-700 px-2 py-1 text-cyan-400">
        /subscribe_to_signals
      </code>{' '}
      command.
    </p>

    <Button className="mt-6" to={ATHENA_TELEGRAM_BOT}>
      Connect Telegram
    </Button>
  </Card>
);

const UnsubscribedOverlay = () => (
  <Card className="mt-12 flex flex-col items-center !bg-[#343942] text-center">
    <div className="mb-4 rounded-full bg-white/10 p-4">
      <Icon name={bxLock} className="text-warning" size={40} />
    </div>

    <h1 className="text-white">You are not subscribed</h1>
    <div className="mt-2 text-slate-400">
      You need to buy one of our subscription plans to have notifications
      enabled.
    </div>

    <Button to="/account/billing" className="mt-6">
      Subscribe
    </Button>
  </Card>
);

export default function useNotificationsOverlay() {
  const account = useAccountQuery();

  const notifyCount =
    account.data?.subscription?.object?.plan.metadata
      .athena_daily_notifications_count ?? 0;

  return account.data?.telegram_id ? (
    notifyCount <= 0 ? (
      <UnsubscribedOverlay />
    ) : null
  ) : (
    <TelegramDisconnectedOverlay />
  );
}
