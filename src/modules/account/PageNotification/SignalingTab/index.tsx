import { useTranslation } from 'react-i18next';
import { useStrategiesQuery } from 'api/notification';
import Locker from 'shared/Locker';
import StrategyCard from './StrategyCard';
import ButtonOpenTelegram from './ButtonOpenTelegram';
import useNotificationsOverlay from './useNotificationsOverlay';
import useModalConnected from './useModalConnected';

export default function SignalingTab() {
  const { t } = useTranslation('notifications');
  const strategies = useStrategiesQuery();
  const overlay = useNotificationsOverlay();
  const ModalConnected = useModalConnected();

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row md:justify-between">
        <div>
          <h2 className="mb-3 text-xl font-semibold">
            {t('signaling.subtitle')}
          </h2>
          <p className="mb-6 text-sm font-medium text-white/60">
            {t('signaling.description')}
          </p>
        </div>
        <div>
          <ButtonOpenTelegram />
          {ModalConnected}
        </div>
      </div>

      <Locker overlay={overlay}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {strategies.data?.results.map(s => (
            <StrategyCard key={s.key} strategy={s} />
          ))}
        </div>
      </Locker>
    </>
  );
}
