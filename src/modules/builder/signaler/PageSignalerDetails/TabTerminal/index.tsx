/* eslint-disable import/max-dependencies */
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bxLineChart } from 'boxicons-quasar';
import { useIsSamePairs } from 'api';
import {
  useSignalerQuery,
  useMySignalerOpenPositions,
  useSignalerAssetPrice,
} from 'api/builder';
import useIsMobile from 'utils/useIsMobile';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import Spinner from 'shared/Spinner';
import Icon from 'shared/Icon';
import AssetSelector from '../../../AssetSelector';
import useSignalFormStates from './AdvancedSignalForm/useSignalFormStates';
import AdvancedSignalForm from './AdvancedSignalForm';
import ActivePositionDetails from './ActivePositionDetails';
import TerminalChart from './TerminalChart';
import CoinInfo from './CoinInfo';
import AvgRewardToRisk from './AvgRewardToRisk';

const TabTerminal = () => {
  const { t } = useTranslation('strategy');
  const isMobile = useIsMobile();
  const params = useParams<{ id: string }>();
  const { data: signaler } = useSignalerQuery(params.id);
  const [assetName, setAssetName] = useSearchParamAsState('asset');
  const isSamePairs = useIsSamePairs();

  const { data, isLoading } = useMySignalerOpenPositions(params.id);
  const activeP = useMemo(
    () => data?.find(x => isSamePairs(x.pair_name, assetName)),
    [assetName, data, isSamePairs],
  );

  const activePosition = useMemo(
    () =>
      activeP && {
        ...activeP,
        suggested_action: activeP?.signal?.action.toUpperCase() as
          | 'CLOSE'
          | 'OPEN'
          | undefined,
      },
    [activeP],
  );
  const formState = useSignalFormStates();

  const { data: marketPrice } = useSignalerAssetPrice({
    strategyKey: params.id,
    assetName,
  });

  const coinRow = (
    <div className="mb-4 flex flex-col justify-start gap-4 border-b border-white/5 pb-4">
      <div className="flex items-end gap-3 mobile:flex-col mobile:items-stretch">
        <AssetSelector
          placeholder={t('common:select-crypto')}
          assets={signaler?.assets.map(x => x.name)}
          selectedItem={assetName}
          onSelect={setAssetName}
          className="w-[250px] mobile:w-full"
          comboClassName="!h-14"
          selectFirst
          market={signaler?.market_name}
        />

        <CoinInfo assetName={assetName} />
      </div>
    </div>
  );

  return (
    <div className="mt-8">
      {isMobile && coinRow}
      <div className="flex gap-4 mobile:flex-col-reverse">
        <div className="basis-2/3">
          {!isMobile && coinRow}

          {isLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            !!assetName &&
            !!signaler && (
              <>
                <h2 className="mb-3 flex items-center gap-1 text-base font-semibold">
                  <Icon name={bxLineChart} />
                  <span>{t('builder:signal-form.chart-title')}</span>
                </h2>
                <TerminalChart
                  assetName={assetName}
                  formState={formState}
                  marketPrice={marketPrice}
                  className="mobile:-mx-4"
                />

                {activePosition && (
                  <>
                    <ActivePositionDetails
                      activePosition={activePosition}
                      className="mt-6"
                    />

                    <AvgRewardToRisk
                      activePosition={activePosition}
                      className="mt-4"
                    />
                  </>
                )}
              </>
            )
          )}
        </div>

        {!!assetName && !!signaler && !isLoading && (
          <AdvancedSignalForm
            signaler={signaler}
            assetName={assetName}
            activePosition={activePosition}
            className="basis-1/3"
            formState={formState}
          />
        )}
      </div>
    </div>
  );
};

export default TabTerminal;
