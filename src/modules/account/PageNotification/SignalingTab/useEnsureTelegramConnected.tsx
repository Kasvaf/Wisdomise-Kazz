import { Trans, useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAccountQuery } from 'api';
import { trackClick } from 'config/segment';
import useConfirm from 'shared/useConfirm';
import Button from 'shared/Button';
import TelegramIcon from './TelegramIcon';
import useTelegramAddress from './useTelegramAddress';

const useEnsureTelegramConnected = () => {
  const { t } = useTranslation('notifications');
  const account = useAccountQuery();
  const telegramBot = useTelegramAddress();

  const [Modal, showModal] = useConfirm({
    yesTitle: '',
    noTitle: '',
    icon: null,
    message: (
      <div className="flex flex-col items-center">
        <div className="mb-4 rounded-full bg-white/10 p-4">
          <TelegramIcon className="bg-white text-black/70" />
        </div>

        <h1 className="text-white">{t('signaling.overlay-telegram.title')}</h1>
        <p className="mt-2 text-center text-slate-400">
          <Trans
            i18nKey="signaling.overlay-telegram.description"
            ns="notifications"
          >
            In order to receive notifications, open Telegram and press on the
            <code className="rounded bg-gray-700 px-2 py-1 text-cyan-400">
              start
            </code>{' '}
            button.
          </Trans>
        </p>

        <Button
          className="mt-6"
          to={telegramBot}
          onClick={trackClick('open_telegram_button')}
          target="_blank"
        >
          {t('signaling.btn-open-telegram.open')}
        </Button>
      </div>
    ),
  });

  const [isConnected, setIsConnected] = useState(!!account.data?.telegram_id);

  const ensureConnected = () => {
    return new Promise<boolean>(resolve => {
      if (isConnected) return resolve(true);
      let stopChecking = false;
      const keepSyncing = (): Promise<boolean> =>
        account.refetch().then(resp => {
          if (resp.data?.telegram_id) {
            setIsConnected(true);
            resolve(true);
            return true;
          } else if (stopChecking) {
            resolve(false);
            return false;
          }
          return new Promise(_resolve =>
            setTimeout(() => _resolve(keepSyncing()), 3000),
          );
        });
      void keepSyncing();
      void showModal()
        .then(() => resolve(false))
        .catch(() => resolve(false))
        .finally(() => (stopChecking = true));
    });
  };

  return [isConnected ? null : Modal, ensureConnected] as const;
};

export default useEnsureTelegramConnected;
