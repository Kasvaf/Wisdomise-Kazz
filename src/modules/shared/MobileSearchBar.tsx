import { bxBell, bxSearch } from 'boxicons-quasar';
import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAlertActions } from 'modules/alert/hooks/useAlertActions';
import { CoinSelect } from 'shared/CoinSelect';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { useHasFlag } from 'api';
import { DebugPin } from './DebugPin';

export const MobileSearchBar: FC<{ className?: string }> = ({ className }) => {
  const hasFlag = useHasFlag();
  const { openSaveModal: openAlert, content: alertModal } = useAlertActions(
    {},
    false,
  );
  const navigate = useNavigate();
  return (
    <>
      <div
        className={clsx(
          'flex w-full items-center gap-2 bg-v1-surface-l1',
          className,
        )}
      >
        <CoinSelect
          allowClear={false}
          chevron={false}
          prefixIcon={
            <Icon name={bxSearch} className="text-v1-content-secondary" />
          }
          onChange={newSlug => newSlug && navigate(`/coin/${newSlug}`)}
          placeholder="Search among 200+ coins…"
          block
          size="md"
          className="grow"
          value={undefined}
        />
        <Button
          size="md"
          className="w-md"
          variant="ghost"
          onClick={() => openAlert()}
          disabled={!hasFlag('/coin-radar/alerts')}
        >
          <DebugPin title="/coin-radar/alerts" color="orange" />

          <Icon name={bxBell} />
        </Button>
      </div>
      {alertModal}
    </>
  );
};
