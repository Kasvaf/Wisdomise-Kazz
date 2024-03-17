import { useTranslation } from 'react-i18next';
import { useStrategiesList } from 'api';
import useModalConnected from './useModalConnected';
import ButtonOpenTelegram from './ButtonOpenTelegram';
import useEnsureTelegramConnected from './useEnsureTelegramConnected';
import StrategyCard from './StrategyCard';

export default function SignalingTab() {
  const { t } = useTranslation('notifications');
  const strategies = useStrategiesList();
  const ModalConnected = useModalConnected();
  const [ModalTelegramConnected, ensureTelegramConnected] =
    useEnsureTelegramConnected();

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
          <ButtonOpenTelegram className="mb-4" />
          {ModalConnected}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {strategies.data
          ?.filter(x => x.profile)
          .map(s => (
            <StrategyCard
              key={s.key}
              strategy={s}
              ensureConnected={ensureTelegramConnected}
            />
          ))}
      </div>
      {ModalTelegramConnected}
    </>
  );
}
