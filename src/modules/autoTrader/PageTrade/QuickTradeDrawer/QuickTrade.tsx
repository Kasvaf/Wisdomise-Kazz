import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { Button } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';
import { Coin } from 'shared/Coin';
import { useSymbolInfo } from 'api/symbol';
import Spinner from 'shared/Spinner';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import useTradeDrawer from '../useTradeDrawer';
import { type TraderInputs } from '../types';
import PartIntro from '../AdvancedSignalForm/PartIntro';
import useSignalFormStates from '../AdvancedSignalForm/useSignalFormStates';
import useSyncFormState from '../AdvancedSignalForm/useSyncFormState';
import BtnFireSignal from '../AdvancedSignalForm/BtnFireSignal';

const QuickTrade: React.FC<TraderInputs> = inputs => {
  const normSlug = inputs.slug === 'solana' ? 'wrapped-solana' : inputs.slug;
  const { data: coin, isLoading: coinLoading } = useSymbolInfo(normSlug);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const formState = useSignalFormStates(inputs);
  const [TradeDrawer, openTradeDrawer] = useTradeDrawer();

  useSyncFormState({
    formState,
    baseSlug: normSlug,
  });

  const {
    confirming: [confirming],
    firing: [firing],
  } = formState;

  return (
    <div>
      {coinLoading ? (
        <div className="my-8 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="relative">
          <div className="mb-8 flex items-center justify-between">
            {coin && <Coin coin={coin} />}
            <BtnWalletConnect />
          </div>

          <PartIntro data={formState} baseSlug={normSlug} noManualPreset />

          {(confirming || firing) && (
            <div
              className={clsx(
                'flex items-center justify-center gap-2 text-sm',
                'absolute inset-0 rounded-sm bg-v1-surface-l4',
              )}
            >
              <Spin size="small" />
              {firing
                ? 'Creating the trading plan...'
                : 'Confirming transaction on network...'}
            </div>
          )}
        </div>
      )}

      <div className="mt-10 flex items-center gap-2">
        <Button
          block
          variant="outline"
          disabled={confirming || firing}
          onClick={() =>
            isMobile
              ? navigate(`/trader/bot/${normSlug ?? ''}`)
              : openTradeDrawer({ slug: normSlug ?? '' })
          }
        >
          Advanced Terminal
        </Button>

        <BtnFireSignal
          formState={formState}
          baseSlug={normSlug}
          className="grow"
        />
      </div>
      {TradeDrawer}
    </div>
  );
};

export default QuickTrade;
