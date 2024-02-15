import { notification } from 'antd';
import {
  type StrategyData,
  useCreateStrategyEntangledFPI,
  useInvestorAssetStructuresQuery,
} from 'api';
import { unwrapErrorMessage } from 'utils/error';
import useModalExchangeAccountSelector from 'modules/account/useModalExchangeAccountSelector';
import useModalDisclaimer from 'modules/products/ButtonFPActivate/useModalDisclaimer';

const useRunCockpit = (strategy?: StrategyData) => {
  const [ModalDisclaimer, openDisclaimer] = useModalDisclaimer();
  const [ModalExchangeAccountSelector, showModalExchangeAccountSelector] =
    useModalExchangeAccountSelector();

  const ias = useInvestorAssetStructuresQuery();
  const hasIas = Boolean(ias.data?.[0]?.main_exchange_account);

  const { mutateAsync, isLoading: isSaving } = useCreateStrategyEntangledFPI();

  const strategyKey = strategy?.key;
  const market = strategy?.market_name;
  const runCockpit = async () => {
    if (!strategyKey) return;

    const acc = await showModalExchangeAccountSelector({ market });
    if (!acc) return;

    if (acc === 'wisdomise' && hasIas && !(await openDisclaimer())) {
      return;
    }

    try {
      await mutateAsync({
        strategyKey,
        externalAccount: !acc || acc === 'wisdomise' ? undefined : acc,
      });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  return {
    runCockpit,
    isSaving,
    modals: (
      <>
        {ModalDisclaimer}
        {ModalExchangeAccountSelector}
      </>
    ),
  };
};

export default useRunCockpit;
