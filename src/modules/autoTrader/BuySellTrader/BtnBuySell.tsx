import { useTranslation } from 'react-i18next';
import { Button } from 'shared/v1-components/Button';
import { useActiveWallet } from 'api/chains';
import { ReactComponent as WarnIcon } from 'modules/autoTrader/PageTrade/AdvancedSignalForm/WarnIcon.svg';
import { type SwapState } from './useSwapState';
import useActionHandlers from './useActionHandlers';

const BtnBuySell: React.FC<{ state: SwapState; className?: string }> = ({
  state,
  className,
}) => {
  const { t } = useTranslation('builder');
  const wallet = useActiveWallet();
  const {
    from: { balanceLoading, balance },
  } = state;

  const { ModalApproval, firePosition, isEnabled, isSubmitting } =
    useActionHandlers(state);

  return (
    <>
      {wallet.connected ? (
        <Button
          variant="primary"
          onClick={firePosition}
          loading={isSubmitting}
          disabled={!isEnabled || !balance}
          className={className}
        >
          {!balanceLoading && balance != null && !balance ? (
            <>
              <WarnIcon className="mr-2" />
              <span className="text-white/70">Insufficient Balance</span>
            </>
          ) : (
            t('signal-form.btn-fire-signal')
          )}
        </Button>
      ) : (
        <Button
          variant="primary"
          onClick={() => wallet.connect()}
          className={className}
        >
          Connect Wallet
        </Button>
      )}
      {ModalApproval}
    </>
  );
};

export default BtnBuySell;
