import { clsx } from 'clsx';
import { bxBell, bxRightArrowAlt, bxsBell } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useSubscription } from 'api';
import { type PairSignalerItem } from 'api/signaler';
import useToggleNotification from 'modules/account/PageNotification/SignalingTab/useToggleNotification';
import useEnsureTelegramConnected from 'modules/account/PageNotification/SignalingTab/useEnsureTelegramConnected';
import Icon from 'shared/Icon';
import Button from 'shared/Button';
import Locker from 'shared/Locker';
import Spin from 'shared/Spin';
import ActivePosition from '../ActivePosition';
import UnprivilegedOverlay from './UnprivilegedOverlay';

const NotificationButton: React.FC<{
  signaler: PairSignalerItem;
  ensureConnected: () => Promise<boolean>;
}> = ({ signaler, ensureConnected }) => {
  const { handler, isSelected, isSubmitting, isLoading } =
    useToggleNotification({
      pairName: signaler.pair_name,
      strategy: signaler.strategy,
      ensureConnected,
    });

  return (
    <Button
      className={clsx(
        'mr-2 !items-center !justify-center !px-4 mobile:!p-[10px]',
        isSelected && 'bg-gradient-to-bl from-[#615298] to-[#42427B]',
      )}
      variant="alternative"
      onClick={handler}
      disabled={isSubmitting || isLoading}
    >
      {isSubmitting || isLoading ? (
        <Spin fontSize={24} />
      ) : (
        <Icon name={isSelected ? bxsBell : bxBell} />
      )}
    </Button>
  );
};

const CoinSignalersList: React.FC<{ signalers?: PairSignalerItem[] }> = ({
  signalers,
}) => {
  const { t } = useTranslation('strategy');
  const { level } = useSubscription();
  const [ModalTelegramConnected, ensureTelegramConnected] =
    useEnsureTelegramConnected();
  if (!signalers) return null;

  return (
    <div className="flex flex-col gap-6">
      {signalers.map(s => (
        <Locker
          key={s.strategy.key}
          overlay={
            (s.strategy.profile.subscription_level ?? 0) > level && (
              <UnprivilegedOverlay
                requiredLevel={s.strategy.profile.subscription_level ?? 0}
              />
            )
          }
          className="justify-center"
        >
          <div className="rounded-2xl bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <h2 className="mx-3 line-clamp-1 text-2xl">
                {s.strategy.profile.title || s.strategy.name}
              </h2>

              <div className="flex items-center">
                <NotificationButton
                  signaler={s}
                  ensureConnected={ensureTelegramConnected}
                />
                <Button
                  className="mobile:!p-[10px_12px]"
                  to={`/insight/signaler?coin=${s.pair_name}&strategy=${s.strategy.key}`}
                >
                  {t('signaler.btn-explore')}
                  <Icon name={bxRightArrowAlt} />
                </Button>
              </div>
            </div>

            <ActivePosition signaler={s} />
          </div>
        </Locker>
      ))}
      {ModalTelegramConnected}
    </div>
  );
};

export default CoinSignalersList;
