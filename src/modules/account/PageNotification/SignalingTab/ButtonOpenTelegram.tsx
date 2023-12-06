import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { ATHENA_TELEGRAM_BOT } from 'config/constants';
import { useAccountQuery } from 'api';
import useIsMobile from 'utils/useIsMobile';
import Button from 'shared/Button';
import Card from 'shared/Card';
import TelegramIcon from './TelegramIcon';

export default function ButtonOpenTelegram() {
  const { t } = useTranslation('notifications');
  const account = useAccountQuery();
  const isMobile = useIsMobile();
  if (!account.data?.telegram_id) return null;

  return (
    <Card
      className={clsx(
        'flex flex-col items-center justify-center gap-4 md:flex-row',
        isMobile && 'mb-10 !p-6',
      )}
    >
      <div className="text-sm sm:hidden lg:block">
        {t('signaling.btn-open-telegram.hint')}
      </div>
      <div>
        <Button
          to={ATHENA_TELEGRAM_BOT}
          target="_blank"
          className="inline-block !py-1 !pl-1 pr-3"
          size="small"
        >
          <TelegramIcon className="mr-2 bg-black text-white" />
          {t('signaling.btn-open-telegram.label')}
        </Button>
      </div>
    </Card>
  );
}
