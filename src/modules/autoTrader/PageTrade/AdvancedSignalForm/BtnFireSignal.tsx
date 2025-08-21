import { notification } from 'antd';
import { type Position, useHasFlag } from 'api';
import { useAccountBalance } from 'api/chains';
import { useActiveWallet } from 'api/chains/wallet';
import { useSymbolInfo } from 'api/symbol';
import { useUserStorage } from 'api/userStorage';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import { useWalletActionHandler } from 'modules/base/wallet/useWalletActionHandler';
import { useTranslation } from 'react-i18next';
import { DebugPin } from 'shared/DebugPin';
import { Button } from 'shared/v1-components/Button';
import { isMiniApp } from 'utils/version';
import useActionHandlers from './useActionHandlers';
import type { SignalFormState } from './useSignalFormStates';
import { ReactComponent as WarnIcon } from './WarnIcon.svg';

const BtnFireSignal: React.FC<{
  baseSlug: string;
  activePosition?: Position;
  formState: SignalFormState;
  className?: string;
}> = ({ baseSlug, activePosition, formState, className }) => {
  const { t } = useTranslation('builder');
  const hasFlag = useHasFlag();
  const wallet = useActiveWallet();
  const isLoggedIn = useIsLoggedIn();

  const {
    isUpdate: [isUpdate],
    quote: [quote],
  } = formState;

  const { data: quoteBalance, isLoading: balanceLoading } =
    useAccountBalance(quote);
  const { data: quoteInfo } = useSymbolInfo(quote);

  const userStorage = useUserStorage('auto-trader-waitlist');

  const joinWaitList = async () => {
    void userStorage.save('true').then(() => {
      notification.success({
        message: (
          <p>
            <strong className="font-bold">You’ve joined the waitlist!</strong>{' '}
            We’ll notify you when it’s your turn to activate.
          </p>
        ),
        description: '',
      });
      return null;
    });
  };

  const { withdrawDepositModal, deposit } = useWalletActionHandler();
  const enableDeposit = wallet.isCustodial && !quoteBalance && !balanceLoading;

  const {
    isEnabled,
    isSubmitting,
    fireHandler,
    updateHandler,
    closeHandler,
    ModalConfirm,
    ModalApproval,
  } = useActionHandlers({
    baseSlug,
    data: formState,
    activePosition,
  });

  const [ModalLogin, showModalLogin] = useModalLogin();
  if (!isLoggedIn) {
    return (
      <>
        {ModalLogin}
        <Button onClick={showModalLogin}>Auto Trade</Button>
      </>
    );
  }

  return (
    <>
      {isUpdate ? (
        <>
          <Button
            disabled={!isEnabled}
            loading={isSubmitting}
            onClick={updateHandler}
          >
            {t('signal-form.btn-update')}
          </Button>
          <Button
            disabled={!isEnabled}
            loading={isSubmitting}
            onClick={closeHandler}
            variant="negative_outline"
          >
            {t('signal-form.btn-close')}
          </Button>
        </>
      ) : hasFlag(
          isMiniApp ? '/trader/positions' : '/trader/positions?mobile',
        ) ? (
        wallet.connected ? (
          enableDeposit ? (
            <Button
              className={className}
              onClick={() => deposit(wallet.address ?? '')}
            >
              Deposit {quoteInfo?.abbreviation} to Fire Position
            </Button>
          ) : (
            <Button
              className={className}
              disabled={!isEnabled}
              loading={isSubmitting}
              onClick={fireHandler}
            >
              <DebugPin color="orange" title="/trader/positions" />
              {!balanceLoading && quoteBalance != null && !quoteBalance ? (
                <>
                  <WarnIcon className="mr-2" />
                  <span className="text-white/70">Insufficient Balance</span>
                </>
              ) : (
                t('signal-form.btn-fire-signal')
              )}
            </Button>
          )
        ) : (
          <Button className={className} onClick={() => wallet.connect()}>
            Connect Wallet
          </Button>
        )
      ) : (
        <div>
          <Button
            className="w-full"
            disabled={userStorage.value === 'true'}
            loading={userStorage.isLoading}
            onClick={() => joinWaitList()}
          >
            {userStorage.value === 'true'
              ? 'Already Joined Waitlist'
              : 'Join Waitlist'}
          </Button>
        </div>
      )}

      {ModalConfirm}
      {ModalApproval}
      {withdrawDepositModal}
    </>
  );
};

export default BtnFireSignal;
