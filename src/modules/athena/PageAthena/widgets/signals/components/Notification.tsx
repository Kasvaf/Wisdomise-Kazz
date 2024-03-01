import { useState } from 'react';
import { isLocal, isProduction } from 'utils/version';
import { ReactComponent as LoadingIcon } from '../icons/loading.svg';
import { ReactComponent as ProVersionIcon } from '../icons/proVersion.svg';
import { ReactComponent as RingOffIcon } from '../icons/ringOff.svg';
import { ReactComponent as RingOnIcon } from '../icons/ringOn.svg';
import { ReactComponent as TelegramIcon } from '../icons/telegram.svg';
import {
  useSubscribeToSignalMutation,
  useSubscribedSignalsQuery,
  useUnsubscribeToSignalMutation,
} from '../services';
import { Modal } from './Modal';
import { useSignals } from './SignalsProvider';

interface Props {
  level: number;
  pairName: string;
  strategyName: string;
  subscribedKey?: string;
}

export const Notification: React.FC<Props> = ({
  pairName,
  strategyName,
  subscribedKey,
  level,
}) => {
  const [loading, setLoading] = useState(false);
  const subscribedSignals = useSubscribedSignalsQuery();
  const subscribeToSignal = useSubscribeToSignalMutation();
  const unsubscribeToSignal = useUnsubscribeToSignalMutation();
  const [telegramModalOpen, setTelegramModalOpen] = useState(false);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const { telegramId, userPlanLevel, onUpgradeClick, onBellClick } =
    useSignals();

  const onRingClick = async () => {
    onBellClick?.();
    if (userPlanLevel < level) {
      setSubscribeModalOpen(true);
    } else if (telegramId) {
      setLoading(true);
      try {
        await (subscribedKey
          ? unsubscribeToSignal.mutateAsync({ key: subscribedKey })
          : subscribeToSignal.mutateAsync({ pairName, strategyName }));
        await subscribedSignals.refetch();
      } catch {}
      setLoading(false);
    } else {
      setTelegramModalOpen(true);
    }
  };

  return (
    <>
      <div className="cursor-pointer" onClick={onRingClick}>
        {loading ? (
          <LoadingIcon className="h-5 w-5" />
        ) : subscribedKey ? (
          <RingOnIcon />
        ) : (
          <RingOffIcon className="mr-[-3px]" />
        )}
      </div>

      <Modal
        open={telegramModalOpen}
        onClose={() => setTelegramModalOpen(false)}
      >
        <div className="flex h-full flex-col items-center justify-center gap-6 p-12 text-center max-md:p-8">
          <div>
            <TelegramIcon className="h-20 w-20" />
          </div>
          <p className="text-lg  text-white/60">
            Your Telegram is not connected
          </p>
          <p className="text-sm font-bold text-white">
            In order to receive notifications, open Telegram and press on the{' '}
            <code className="text-info">start</code> button.
          </p>
          <a
            target="_blank"
            className="w-full rounded-full bg-white py-3 font-bold text-black"
            href={
              !isProduction || isLocal
                ? 'https://t.me/staging_wisdomise_chat_bot'
                : 'https://t.me/wisdomise_chat_bot'
            }
            rel="noreferrer"
          >
            Open Telegram
          </a>
        </div>
      </Modal>

      <Modal
        open={subscribeModalOpen}
        onClose={() => setSubscribeModalOpen(false)}
      >
        <div className="flex h-full flex-col items-center justify-center gap-6 p-12 text-center max-md:p-8">
          <div>
            <ProVersionIcon className="h-20 w-20" />
          </div>
          <p className="text-2xl font-bold text-white">Upgrade</p>
          <p className=" text-base text-white/60">
            You must upgrade your plan first to be able to set your signal
            notification
          </p>
          <button
            className="w-full rounded-full bg-white py-3 font-bold text-black"
            onClick={onUpgradeClick}
          >
            Upgrade Now
          </button>
        </div>
      </Modal>
    </>
  );
};
