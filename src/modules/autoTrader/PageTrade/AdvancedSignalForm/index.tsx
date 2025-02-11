import { clsx } from 'clsx';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { type Position, useHasFlag } from 'api';
import { useAccountBalance, useActiveWallet } from 'api/chains';
import { useUserStorage } from 'api/userStorage';
import { isMiniApp } from 'utils/version';
import { DebugPin } from 'shared/DebugPin';
import Button from 'shared/Button';
import useActionHandlers from './useActionHandlers';
import useSyncFormState from './useSyncFormState';
import PartSafetyOpen from './PartSafetyOpen';
import PartOpen from './PartOpen';
import PartTpSl from './PartTpSl';
import { type SignalFormState } from './useSignalFormStates';
import { ReactComponent as WarnIcon } from './WarnIcon.svg';

interface Props {
  baseSlug: string;
  activePosition?: Position;
  formState: SignalFormState;
  className?: string;
}

const AdvancedSignalForm: React.FC<Props> = ({
  baseSlug,
  activePosition,
  formState,
  className,
}) => {
  const { t } = useTranslation('builder');
  const hasFlag = useHasFlag();
  const wallet = useActiveWallet();
  const {
    isUpdate: [isUpdate],
    quote: [quote],
  } = formState;

  const { data: quoteBalance, isLoading: balanceLoading } =
    useAccountBalance(quote);

  useSyncFormState({
    formState,
    baseSlug,
    activePosition,
  });

  const {
    isEnabled,
    isSubmitting,
    fireHandler,
    updateHandler,
    closeHandler,
    ModalConfirm,
    ModalApproval,
  } = useActionHandlers({
    data: formState,
    activePosition,
  });

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

  // ======================================================================

  return (
    <div className={clsx('flex flex-col gap-3', className)}>
      <div className="flex flex-col gap-5">
        <PartOpen data={formState} baseSlug={baseSlug} />
        <PartSafetyOpen data={formState} baseSlug={baseSlug} />
        <PartTpSl type="TP" data={formState} baseSlug={baseSlug} />
        <PartTpSl type="SL" data={formState} baseSlug={baseSlug} />
      </div>

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
          <Button variant="brand" onClick={() => wallet.connect()}>
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
    </div>
  );
};

export default AdvancedSignalForm;
