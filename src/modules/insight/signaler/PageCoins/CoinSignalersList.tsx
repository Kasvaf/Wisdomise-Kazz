import { bxRightArrowAlt } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useSubscription } from 'api';
import { type PairSignalerItem } from 'api/signaler';
import { trackClick } from 'config/segment';
import useIsMobile from 'utils/useIsMobile';
import InfoButton from 'shared/InfoButton';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import NotificationButton from 'modules/account/PageNotification/NotificationButton';
import ActivePosition from '../ActivePosition';
import SignalerOwnerLink from './SignalerOwnerLink';
import UnprivilegedOverlay from './UnprivilegedOverlay';

const CoinSignalersList: React.FC<{ signalers?: PairSignalerItem[] }> = ({
  signalers,
}) => {
  const { t } = useTranslation('strategy');
  const { level } = useSubscription();
  const isMobile = useIsMobile();
  if (!signalers) return null;

  return (
    <div className="flex flex-col gap-6">
      {signalers.map(s => {
        const requiredLevel = s.strategy.profile?.subscription_level ?? 0;
        const isLocked = requiredLevel > level;

        return (
          <div key={s.strategy.key} className="rounded-2xl bg-[#1A1B1F] p-3">
            <div className="flex items-center justify-between">
              <h2 className="mx-3 line-clamp-1 flex items-center text-2xl">
                {s.strategy.profile?.title || s.strategy.name}
                {s.strategy.profile?.description && (
                  <InfoButton
                    className="ml-2"
                    title={s.strategy.profile?.title || s.strategy.name}
                    text={s.strategy.profile?.description}
                  />
                )}

                {!isMobile && (
                  <SignalerOwnerLink
                    user={s.strategy?.owner}
                    className="ml-3"
                  />
                )}
              </h2>

              {!isLocked && (
                <div className="flex items-center">
                  <NotificationButton
                    pairName={s.pair_name}
                    strategy={s.strategy}
                    className="mr-2"
                  />
                  <Button
                    variant="link"
                    className="!px-3 mobile:!p-[10px_12px]"
                    to={`/insight/coins/signaler?coin=${s.pair_name}&strategy=${s.strategy.key}`}
                    onClick={trackClick('coin_signaler', {
                      coin_name: s.pair_name,
                      strategy_name: s.strategy.name,
                    })}
                  >
                    {t('signaler.btn-explore')}
                    <Icon name={bxRightArrowAlt} />
                  </Button>
                </div>
              )}
            </div>
            {isMobile && (
              <SignalerOwnerLink user={s.strategy?.owner} className="my-3" />
            )}

            <ActivePosition
              position={s}
              locked={
                isLocked && (
                  <UnprivilegedOverlay requiredLevel={requiredLevel} />
                )
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default CoinSignalersList;
