import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { type Position, useHasFlag } from 'api';
import { useAccountBalance, useActiveWallet } from 'api/chains';
import { useUserStorage } from 'api/userStorage';
import { isMiniApp } from 'utils/version';
import { DebugPin } from 'shared/DebugPin';
import Button from 'shared/Button';
import useActionHandlers from './useActionHandlers';
import { type SignalFormState } from './useSignalFormStates';
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

  const {
    isUpdate: [isUpdate],
    quote: [quote],
  } = formState;

  const { data: quoteBalance, isLoading: balanceLoading } =
    useAccountBalance(quote);

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

  return (
    <>
      {isUpdate ? (
        <>
          <Button
            variant="brand"
            onClick={updateHandler}
            loading={isSubmitting}
            disabled={!isEnabled}
          >
            {t('signal-form.btn-update')}
          </Button>
          <Button
            variant="secondary-red"
            onClick={closeHandler}
            loading={isSubmitting}
            disabled={!isEnabled}
          >
            {t('signal-form.btn-close')}
          </Button>
        </>
      ) : hasFlag(
          isMiniApp ? '/trader-positions' : '/trader-positions?mobile',
        ) ? (
        wallet.connected ? (
          <Button
            variant="brand"
            onClick={fireHandler}
            loading={isSubmitting}
            disabled={!isEnabled}
            className={className}
          >
            <DebugPin title="/trader-positions" color="orange" />
            {!balanceLoading && quoteBalance != null && !quoteBalance ? (
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
            variant="brand"
            onClick={() => wallet.connect()}
            className={className}
          >
            Connect Wallet
          </Button>
        )
      ) : (
        <div>
          <Button
            variant="brand"
            loading={userStorage.isLoading}
            disabled={userStorage.value === 'true'}
            className="w-full"
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
    </>
  );
};

export default BtnFireSignal;
