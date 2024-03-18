import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { bxCheck } from 'boxicons-quasar';
import { useAccountQuery } from 'api';
import useIsMobile from 'utils/useIsMobile';
import Button from 'shared/Button';
import Card from 'shared/Card';
import Icon from 'shared/Icon';
import TelegramIcon from './TelegramIcon';
import useTelegramAddress from './useTelegramAddress';
import useEnsureTelegramConnected from './useEnsureTelegramConnected';

const ButtonOpenTelegram: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { t } = useTranslation('notifications');
  const account = useAccountQuery();
  const isMobile = useIsMobile();
  const telegramBot = useTelegramAddress();
  const isConnected = Boolean(account.data?.telegram_id);
  const [Modal, showModal] = useEnsureTelegramConnected();

  return (
    <Card
      className={clsx(
        'flex flex-col items-center justify-center gap-4 !p-6 md:flex-row',
        isMobile && 'mb-10',
        className,
      )}
    >
      {isConnected ? (
        <div className="flex items-center text-sm text-white/70">
          <Icon name={bxCheck} className="mr-2 text-success" />
          {t('signaling.btn-open-telegram.is-connected')}
        </div>
      ) : (
        <div className="text-sm sm:hidden lg:block">
          {t('signaling.btn-open-telegram.hint')}
        </div>
      )}

      <div>
        <Button
          to={telegramBot}
          target="_blank"
          className="inline-block !py-1 !pl-1 pr-3"
          size="small"
          onClick={e => {
            if (!isConnected) {
              e.preventDefault();
              void showModal();
            }
          }}
        >
          <TelegramIcon className="mr-2 bg-black text-white" />
          {isConnected
            ? t('signaling.btn-open-telegram.open')
            : t('signaling.btn-open-telegram.connect')}
        </Button>
      </div>
      {Modal}
    </Card>
  );
};

export default ButtonOpenTelegram;
