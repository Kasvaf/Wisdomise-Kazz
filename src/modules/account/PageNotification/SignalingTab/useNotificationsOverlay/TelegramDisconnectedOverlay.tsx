import { Trans, useTranslation } from 'react-i18next';
import Button from 'modules/shared/Button';
import Card from 'modules/shared/Card';
import { ATHENA_TELEGRAM_BOT } from 'config/constants';
import TelegramIcon from '../TelegramIcon';

const TelegramDisconnectedOverlay = () => {
  const { t } = useTranslation('notifications');

  return (
    <Card className="mt-12 flex flex-col items-center !bg-[#343942] text-center">
      <div className="mb-4 rounded-full bg-white/10 p-4">
        <TelegramIcon className="bg-white text-black/70" />
      </div>

      <h1 className="text-white">{t('signaling.overlay-telegram.title')}</h1>
      <p className="mt-2 text-slate-400">
        <Trans
          i18nKey="signaling.overlay-telegram.description"
          ns="notifications"
        >
          Go to telegram and use
          <code className="rounded bg-gray-700 px-2 py-1 text-cyan-400">
            /subscribe_to_signals
          </code>
          command.
        </Trans>
      </p>

      <Button className="mt-6" to={ATHENA_TELEGRAM_BOT}>
        {t('signaling.btn-open-telegram.label')}
      </Button>
    </Card>
  );
};

export default TelegramDisconnectedOverlay;
