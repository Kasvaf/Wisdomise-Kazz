import { bxBell, bxSearch } from 'boxicons-quasar';
import { type ComponentProps, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useAlertActions } from 'modules/alert/hooks/useAlertActions';
import { CoinSelect } from 'shared/CoinSelect';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { useAlerts, useHasFlag } from 'api';
import { type Surface } from 'utils/useSurface';
import { DebugPin } from './DebugPin';
import { type Select } from './v1-components/Select';

export const GlobalSearchBar: FC<{
  className?: string;
  size?: ComponentProps<typeof Select>['size'];
  selectorSurface?: Surface;
  buttonSurface?: Surface;
}> = ({ className, selectorSurface = 2, buttonSurface = 1, size }) => {
  const { t } = useTranslation('common');
  const hasFlag = useHasFlag();
  const { openSaveModal: openAlert, content: alertModal } = useAlertActions(
    {},
    false,
  );
  const alerts = useAlerts({});
  const isUsedAlertBefore = !!alerts.data?.length;
  const navigate = useNavigate();

  return (
    <>
      <div className={clsx('flex items-center gap-2', className)}>
        <CoinSelect
          allowClear={false}
          chevron={false}
          prefixIcon={
            <Icon name={bxSearch} className="text-v1-content-secondary" />
          }
          onChange={newSlug => newSlug && navigate(`/coin/${newSlug}`)}
          placeholder={t('search_coins')}
          block
          size={size}
          className="grow"
          value={undefined}
          surface={selectorSurface}
        />
        <Button
          size={size}
          variant="outline"
          onClick={() => openAlert()}
          disabled={!hasFlag('/coin-radar/alerts')}
          surface={buttonSurface}
          fab
        >
          <DebugPin title="/coin-radar/alerts" color="orange" />
          <Icon name={bxBell} />
          {isUsedAlertBefore && (
            <div className="absolute right-0 top-0 size-[6px] rounded-full bg-v1-background-brand" />
          )}
        </Button>
      </div>
      {alertModal}
    </>
  );
};
