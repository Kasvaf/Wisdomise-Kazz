import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { bxBell, bxsBell } from 'boxicons-quasar';
import { useAccountQuery } from 'api';
import { type StrategyItem } from 'api/signaler';
import { trackClick } from 'config/segment';
import SignalChip from 'modules/account/PageNotification/SignalingTab/SignalChip';
import useEnsureTelegramConnected from 'modules/account/PageNotification/SignalingTab/useEnsureTelegramConnected';
import useModal from 'shared/useModal';
import Button from 'shared/Button';
import Icon from 'shared/Icon';

const ButtonNotificationModifier: React.FC<{
  strategy: StrategyItem;
}> = ({ strategy: s }) => {
  const { t } = useTranslation('notifications');
  const account = useAccountQuery();
  const [ModalTelegramConnected, ensureTelegramConnected] =
    useEnsureTelegramConnected();

  const [Modal, showModal] = useModal(() => (
    <div className="flex flex-col items-center">
      <div className="mb-8 text-center font-semibold">
        {t('signaling.telegram-notification')}
      </div>

      <div className="mb-6 rounded-xl bg-white/10 px-6 py-3 text-2xl">
        {s.profile?.title ?? s.name}
      </div>

      <p className="text-base text-white/60">
        {t('signaling.strategy.choose-coin')}
      </p>

      <div className="flex flex-wrap justify-center">
        {s.supported_pairs.map(pair => (
          <SignalChip
            key={pair.name}
            pair={pair}
            strategy={s}
            ensureConnected={ensureTelegramConnected}
          />
        ))}
      </div>
    </div>
  ));

  const clickHandler = async () => {
    trackClick('signaler_enable_notification', {
      signaler: s.name,
    })();
    if (!(await ensureTelegramConnected())) return;
    await showModal({});
  };

  const isConnected = !!account.data?.telegram_id;
  return (
    <>
      <Button
        variant="alternative"
        onClick={clickHandler}
        className={clsx(
          isConnected && 'bg-gradient-to-bl from-[#615298] to-[#42427B]',
        )}
      >
        <Icon name={isConnected ? bxsBell : bxBell} className="mr-2" />
        {isConnected
          ? t('signaling.modify-notification')
          : t('signaling.turn-on-notification')}
      </Button>
      {Modal}
      {ModalTelegramConnected}
    </>
  );
};

export default ButtonNotificationModifier;
