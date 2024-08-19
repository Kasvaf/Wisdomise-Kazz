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
import Button from 'shared/Button';
import Badge from 'shared/Badge';
import Icon from 'shared/Icon';

const isClosed = (p: PairSignalerItem) => Boolean(p.exit_time);

const LabeledInfo: React.FC<
  PropsWithChildren<{ label: string; labelClassName?: string }>
> = ({ label, children, labelClassName }) => {
  return (
    <div className="items-center justify-between text-xs text-white mobile:flex">
      <div className={clsx('text-white/70', labelClassName)}>{label}</div>
      <div className="mt-4 mobile:mt-0">{children}</div>
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
  const { label: actionLabel, color: actionColor } =
    suggestions[pos.suggested_action];

  const profileUrl = `/users/${pos.strategy.owner?.key ?? ''}`;
  const buttons = (
    <div className="flex justify-stretch gap-2">
      <Button
        className="grow !rounded-md !px-4 !py-2 text-xxs"
        variant="alternative"
        to={profileUrl}
      >
        Profile
      </Button>
      <Button
        className="grow !rounded-md !px-4 !py-2 text-xxs"
        variant="alternative"
      >
        Details
      </Button>
    </div>
  );

  return (
    <NavLink
      className={clsx(
        'flex cursor-pointer flex-col rounded-lg bg-white/[.02] p-6 hover:bg-white/[0.03]',
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
      <div className="flex h-10 items-center gap-3 overflow-hidden mobile:w-full">
        <NavLink to={profileUrl}>
          <ProfilePhoto
            src={pos.strategy.owner?.cprofile.profile_image}
            type="avatar"
            className="h-10 w-10 rounded-full hover:saturate-150"
          />
        </NavLink>
        <NavLink className="line-clamp-1 py-0.5 text-xs" to={profileUrl}>
          {pos.strategy.owner?.cprofile.nickname ||
            truncateUserId(pos.strategy.owner?.key ?? 'Unknown')}
          &nbsp;
        </NavLink>
        <div className="grow" />
        {!isMobile && buttons}
      </div>

      <div className="my-5 border-t border-white/10" />

      <div className="flex justify-between mobile:w-full mobile:flex-col mobile:gap-6">
        <LabeledInfo label="Entry Time">
          <ReadableDate value={pos.entry_time} />
        </LabeledInfo>

        <LabeledInfo label="Suggestion">
          {SubModal}
          {PositionDetailModal}
          {isLocked ? (
            subLink
          ) : (
            <Badge
              className="!px-0 !text-xxs"
              label={actionLabel}
              color={actionColor}
            />
          )}
        </LabeledInfo>

        <LabeledInfo label="Position Side">
          {isLocked ? subLink : pos.position_side.toLowerCase()}
        </LabeledInfo>

        <LabeledInfo label="Position P/L">
          <PriceChange className="!justify-start text-xs" value={pos.pnl} />
        </LabeledInfo>

        <LabeledInfo label="Status">
          {isClosed(pos) ? t('status.closed') : t('status.opened')}
        </LabeledInfo>

        <LabeledInfo label="Strategy">{pos.strategy.name}</LabeledInfo>

        {isMobile && buttons}
      </div>
    </NavLink>
  );
};

export default StrategyPositionBox;
