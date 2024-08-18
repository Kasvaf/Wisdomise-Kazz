/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { bxLockAlt } from 'boxicons-quasar';
import { useSubscription, type PairSignalerItem } from 'api';
import useIsMobile from 'utils/useIsMobile';
import { useSuggestionsMap } from 'modules/insight/PageSignalsMatrix/constants';
import { ProfilePhoto } from 'modules/account/PageProfile/ProfilePhoto';
import { truncateUserId } from 'modules/account/PageProfile/truncateUserId';
import useSignalSubscriptionModal from 'modules/insight/PageSignalsMatrix/useSignalSubscriptionModal';
import usePositionDetailModal from 'modules/insight/usePositionDetailModal';
import { ReadableDate } from 'shared/ReadableDate';
import PriceChange from 'shared/PriceChange';
import Badge from 'shared/Badge';
import Icon from 'shared/Icon';

const isClosed = (p: PairSignalerItem) => Boolean(p.exit_time);

const LabeledInfo: React.FC<
  PropsWithChildren<{ label: string; labelClassName?: string }>
> = ({ label, children, labelClassName }) => {
  return (
    <div className="flex items-center mobile:mb-3 mobile:justify-between">
      <div className={clsx('text-xxs text-white/70', labelClassName)}>
        {label}:
      </div>
      <div className="flex h-5 items-center text-xs">{children}</div>
    </div>
  );
};

const StrategyPositionBox: React.FC<{
  position: PairSignalerItem;
  className?: string;
}> = ({ position: pos, className }) => {
  const { t } = useTranslation('strategy');
  const isMobile = useIsMobile();

  const { level } = useSubscription();
  const requiredLevel = pos.strategy.profile?.subscription_level ?? 0;
  const [SubModal, showSubModal] = useSignalSubscriptionModal(requiredLevel);
  const isLocked = requiredLevel > level;
  const subLink = (
    <div className="-ml-6 flex items-center">
      <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-white/10">
        <Icon name={bxLockAlt} size={12} />
      </div>
      <span className="text-[#00a3f0] underline">Subscribe to Unlock</span>
    </div>
  );

  const detailsLink = `/marketplace/coins/signaler?coin=${pos.pair_name}&strategy=${pos.strategy.key}`;
  const [PositionDetailModal, showPositionDetailModal] = usePositionDetailModal(
    pos,
    detailsLink,
  );

  const suggestions = useSuggestionsMap();
  const { label: actionLabel } = suggestions[pos.suggested_action];

  return (
    <NavLink
      className={clsx(
        'flex cursor-pointer rounded-lg bg-white/[.02] p-6 hover:bg-white/[0.03]',
        className,
      )}
      to={detailsLink}
      onClick={e => {
        e.preventDefault();
        if (isLocked) {
          void showSubModal();
          return;
        }
        void showPositionDetailModal();
      }}
    >
      <div className="flex h-10 w-2/5 items-stretch gap-3 overflow-hidden mobile:w-full">
        <NavLink to={`/users/${pos.strategy.owner?.key ?? ''}`}>
          <ProfilePhoto
            src={pos.strategy.owner?.cprofile.profile_image}
            type="avatar"
            className="h-10 w-10 rounded-full hover:saturate-150"
          />
        </NavLink>
        <div className="flex flex-col justify-between py-0.5">
          <div className="line-clamp-1 text-xs">
            <NavLink to={`/users/${pos.strategy.owner?.key ?? ''}`}>
              {pos.strategy.owner?.cprofile.nickname ||
                truncateUserId(pos.strategy.owner?.key ?? 'Unknown')}
              &nbsp;
            </NavLink>
            <span className="text-white/70">
              ({pos.strategy.profile?.title ?? pos.strategy.name})
            </span>
          </div>
          <div className="line-clamp-1 text-xxs">
            <span className="text-white/70">Entry Time&nbsp;</span>
            <span>
              <ReadableDate value={pos.entry_time} />
            </span>
          </div>
        </div>
      </div>

      {isMobile ? (
        <div className="my-5 border-t border-white/10" />
      ) : (
        <div className="ml-2 mr-8 border-l border-white/10" />
      )}

      <div className="flex w-3/5 justify-between mobile:w-full mobile:flex-col">
        <div className="flex flex-col justify-between">
          <LabeledInfo label="Action" labelClassName="w-24">
            {SubModal}
            {PositionDetailModal}
            {isLocked ? subLink : actionLabel}
          </LabeledInfo>
          <LabeledInfo label="Position Side" labelClassName="w-24">
            {isLocked ? subLink : pos.position_side.toLowerCase()}
          </LabeledInfo>
        </div>

        <div className="flex flex-col justify-between">
          <LabeledInfo label="P/L" labelClassName="w-16">
            <PriceChange className="text-xs" value={pos.pnl} />
          </LabeledInfo>
          <LabeledInfo label="Status" labelClassName="w-16">
            {isClosed(pos) ? (
              <Badge
                className="grow !text-xxs"
                label={t('status.closed')}
                color="red"
              />
            ) : (
              <Badge
                className="grow !text-xxs"
                label={t('status.opened')}
                color="green"
              />
            )}
          </LabeledInfo>
        </div>
      </div>
    </NavLink>
  );
};

export default StrategyPositionBox;
