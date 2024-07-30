import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { type PairSignalerItem } from 'api';
import { ProfilePhoto } from 'modules/account/PageProfile/ProfilePhoto';
import PriceChange from 'shared/PriceChange';
import Badge from 'shared/Badge';
import { useSuggestionsMap } from 'modules/insight/PageSignalsMatrix/constants';
import { ReadableDate } from 'shared/ReadableDate';
import { truncateUserId } from 'modules/account/PageProfile/truncateUserId';

const isClosed = (p: PairSignalerItem) => Boolean(p.exit_time);

const SignalBoxSuggestion: React.FC<{
  position: PairSignalerItem;
  className?: string;
}> = ({ position: p }) => {
  const suggestions = useSuggestionsMap();
  const { label, color } = suggestions[p.suggested_action];
  return <Badge className="grow !text-xxs" label={label} color={color} />;
};

const LabeledInfo: React.FC<
  PropsWithChildren<{ label: string; labelClassName?: string }>
> = ({ label, children, labelClassName }) => {
  return (
    <div className="flex items-center">
      <div className={clsx('text-xxs text-white/70', labelClassName)}>
        {label}:
      </div>
      <div className="flex h-5 items-center text-xs">{children}</div>
    </div>
  );
};

const StrategyPositionBox: React.FC<{ position: PairSignalerItem }> = ({
  position: pos,
}) => {
  const { t } = useTranslation('strategy');

  return (
    <div key={pos.strategy.key} className="flex rounded-lg bg-black/40 p-6">
      <div className="flex h-10 w-2/5 items-stretch gap-3 overflow-hidden pr-2">
        <ProfilePhoto
          src={pos.strategy.owner?.cprofile.profile_image}
          type="avatar"
          className="h-10 w-10 rounded-full"
        />
        <div className="flex flex-col justify-between py-0.5">
          <div className="line-clamp-1 text-xs">
            <span>
              {pos.strategy.owner?.cprofile.nickname ||
                truncateUserId(pos.strategy.owner?.key ?? 'Unknown')}
              &nbsp;
            </span>
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

      <div className="flex w-3/5 justify-between border-l border-white/10 pl-8">
        <div className="flex flex-col justify-between">
          <LabeledInfo label="Status" labelClassName="w-24">
            {isClosed(pos) ? t('status.closed') : t('status.opened')}
          </LabeledInfo>
          <LabeledInfo label="Position Side" labelClassName="w-24">
            {pos.position_side.toLowerCase()}
          </LabeledInfo>
        </div>

        <div className="flex flex-col justify-between">
          <LabeledInfo label="P/L" labelClassName="w-16">
            <PriceChange className="text-xs" value={pos.pnl} />
          </LabeledInfo>
          <LabeledInfo label="Action" labelClassName="w-16">
            <SignalBoxSuggestion className="text-xs" position={pos} />
          </LabeledInfo>
        </div>
      </div>
    </div>
  );
};

export default StrategyPositionBox;
