import { notification } from 'antd';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  type StrategyData,
  useCreateStrategyEntangledFPI,
  useInvestorAssetStructuresQuery,
  useIsVerified,
} from 'api';
import { unwrapErrorMessage } from 'utils/error';
import useModalVerification from 'modules/products/useModalVerification';
import useModalExchangeAccountSelector from 'modules/account/useModalExchangeAccountSelector';
import useModalDisclaimer from 'modules/products/ButtonFPActivate/useModalDisclaimer';

const useRunCockpit = (strategy?: StrategyData) => {
  const navigate = useNavigate();
  const isVerified = useIsVerified();
  const [ModalDisclaimer, openDisclaimer] = useModalDisclaimer();
  const [ModalVerification, openVerification] = useModalVerification();
  const [ModalExchangeAccountSelector, showModalExchangeAccountSelector] =
    useModalExchangeAccountSelector();

  const ias = useInvestorAssetStructuresQuery();
  const hasIas = Boolean(ias.data?.[0]?.main_exchange_account);

  const { mutateAsync, isLoading: isSaving } = useCreateStrategyEntangledFPI();

  const strategyKey = strategy?.key;
  const market = strategy?.market_name;
  const runCockpit = useCallback(async () => {
    if (!strategyKey) return;

    if (isVerified.isLoading) return;
    if (!isVerified.isAllVerified) {
      if (await openVerification()) {
        navigate('/account/kyc');
      }
      return;
    }

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
  }, [
    hasIas,
    isVerified,
    strategyKey,
    market,
    navigate,
    openDisclaimer,
    openVerification,
    showModalExchangeAccountSelector,
    mutateAsync,
  ]);

  return {
    runCockpit,
    isSaving,
    modals: (
      <>
        {ModalDisclaimer}
        {ModalVerification}
        {ModalExchangeAccountSelector}
      </>
    ),
  };
};

export default useRunCockpit;
