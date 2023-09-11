/* eslint-disable import/max-dependencies */
import * as numerable from 'numerable';
import { useCallback, useRef, useState } from 'react';
import { notification } from 'antd';
import { bxInfoCircle } from 'boxicons-quasar';
import {
  useConfirmWithdrawMutation,
  useCreateWithdrawMutation,
  useInvestorAssetStructuresQuery,
  useResendWithdrawEmailMutation,
} from 'api';
import { ACCOUNT_ORIGIN } from 'config/constants';
import { roundDown } from 'utils/numbers';
import Spinner from 'shared/Spinner';
import TextBox from 'shared/TextBox';
import Button from 'shared/Button';
import MultiButton from 'shared/MultiButton';
import { unwrapErrorMessage } from 'utils/error';
import { type VerifiedWallet } from 'api/kyc';
import Banner from 'modules/shared/Banner';
import useWithdrawalConfirm from './useWithdrawalConfirm';
import useWithdrawSuccess from './useWithdrawSuccess';
import useNetworkConfirm from './useNetworkConfirm';
import useSecurityInput from './useSecurityInput';
import WalletSelector from './WalletSelector';

const InfoLabel = ({
  label,
  value,
  unit,
}: {
  label: string;
  value?: number;
  unit?: string;
}) => {
  return (
    <div className="mb-2 flex justify-between rounded-full bg-black/10 px-4 py-2 text-xs">
      <div>{label}</div>
      <div>
        {value == null || Number.isNaN(value)
          ? ''
          : numerable.format(value, '0,0.00', {
              rounding: 'floor',
            })}{' '}
        <span className="text-white/40">{unit}</span>
      </div>
    </div>
  );
};

const toAmount = (v: string) =>
  v
    .replaceAll(/[^\d.]+/g, '')
    .replace(/^(0+)/, '')
    .replace(/^\./, '0.')
    .replace(/^(\d+(\.\d*))\..*$/, '$1') || '0';

const ModalWithdraw: React.FC<{ onResolve?: () => void }> = ({ onResolve }) => {
  const ias = useInvestorAssetStructuresQuery();
  const mea = ias.data?.[0]?.main_exchange_account;
  const [wallet, setWallet] = useState<VerifiedWallet>();

  const available = roundDown(mea?.quote_equity ?? 0);
  const fee = +(wallet?.network?.binance_info?.withdrawFee ?? 0);
  const minWithdrawable = +(wallet?.network?.binance_info?.withdrawMin ?? 0);

  // ----------------------------------------------------

  const [amount, setAmount] = useState('');
  let amountError: string | undefined;
  if (Number.parseFloat(amount) < minWithdrawable) {
    amountError = `You cannot withdraw less than ${String(minWithdrawable)} ${
      wallet?.symbol.name || ''
    } in ${wallet?.network?.name || ''} network.`;
  } else if (Number.parseFloat(amount) > available) {
    amountError = 'You cannot withdraw more than your available amount.';
  }

  const autoAmountHandler = useCallback(
    (opt: string) => {
      switch (opt) {
        case 'Min': {
          setAmount(String(minWithdrawable));
          break;
        }
        case '50%': {
          setAmount((available / 2).toFixed(2));
          break;
        }
        case 'Max': {
          setAmount(String(available));
          break;
        }
      }
    },
    [available, minWithdrawable],
  );

  const withdrawInfo = {
    crypto: wallet?.symbol.name || '',
    network: wallet?.network,
    amount: Number.parseFloat(amount),
    wallet: wallet?.address || '',
    fee,
    source: mea?.exchange_market.market.name || '',
  };
  const [ConfirmNetworkModal, openConfirmNetwork] = useNetworkConfirm(
    wallet?.network,
  );
  const [ConfirmWithdrawalModal, openConfirmWithdrawal] =
    useWithdrawalConfirm(withdrawInfo);
  const [WithdrawSuccessModal, showSuccess] = useWithdrawSuccess(withdrawInfo);

  const createWithdraw = useCreateWithdrawMutation();
  const doCreateWithdraw = useCallback(async () => {
    if (!wallet) throw new Error('unexpected');

    const exchangeAccountKey = ias.data?.[0]?.main_exchange_account.key;
    if (!exchangeAccountKey) throw new Error('unexpected');
    return await createWithdraw({
      tx_type: 'WITHDRAW',
      symbol_name: wallet.symbol.name,
      network_name: wallet.network?.name || '',
      address: wallet.address,
      amount,
      exchangeAccountKey,
    });
  }, [amount, createWithdraw, ias.data, wallet]);

  const transactionKey = useRef('');
  const resendWithdrawEmail = useResendWithdrawEmailMutation();
  const confirmWithdraw = useConfirmWithdrawMutation();
  const exchangeAccountKey = ias.data?.[0]?.main_exchange_account.key;

  const [SecurityInputModal, confirmSecurityCode] = useSecurityInput({
    onConfirm: useCallback(
      async (code: string) => {
        if (!exchangeAccountKey || !transactionKey.current) {
          throw new Error('unexpected');
        }

        await confirmWithdraw({
          exchangeAccountKey,
          verificationCode: code,
          transactionKey: transactionKey.current,
        });
      },
      [exchangeAccountKey, confirmWithdraw],
    ),
    onResend: useCallback(async () => {
      if (!exchangeAccountKey || !transactionKey.current) return;
      await resendWithdrawEmail({
        exchangeAccountKey,
        transactionKey: transactionKey.current,
      });
    }, [exchangeAccountKey, resendWithdrawEmail]),
  });

  const [submitting, setSubmitting] = useState(false);
  const withdrawHandler = useCallback(async () => {
    try {
      setSubmitting(true);
      if (!(await openConfirmNetwork())) return;

      if (
        !(await (async function create(): Promise<boolean> {
          if (!(await openConfirmWithdrawal())) return false;
          try {
            transactionKey.current = (await doCreateWithdraw()).key;
            return true;
          } catch (error) {
            const msg = unwrapErrorMessage(error);
            if (!msg) return false;

            notification.error({
              message: 'Error',
              description: unwrapErrorMessage(error),
            });

            // repeat until no-error is raised
            return await create();
          }
        })())
      )
        return;

      if (!(await confirmSecurityCode())) return;
      await showSuccess();
      onResolve?.();
    } finally {
      setSubmitting(false);
    }
  }, [
    openConfirmNetwork,
    openConfirmWithdrawal,
    confirmSecurityCode,
    doCreateWithdraw,
    showSuccess,
    onResolve,
  ]);

  if (submitting) {
    return (
      <div className="text-white">
        <h1 className="mb-6 text-center text-xl">Deposit</h1>
        <ConfirmNetworkModal />
        <ConfirmWithdrawalModal />
        <SecurityInputModal />
        <WithdrawSuccessModal />
        <div className="mt-2 flex justify-center py-2">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h1 className="mb-6 text-center text-xl">Withdraw</h1>

      <Banner icon={bxInfoCircle} className="mb-10">
        <span className="text-white/80">
          To Withdraw you have to choose from a Verified Wallet Address.
        </span>{' '}
        <a
          href={`${ACCOUNT_ORIGIN}/kyc`}
          target="_blank"
          className="font-bold underline"
          rel="noreferrer"
        >
          Verify Wallet
        </a>
      </Banner>

      <div className="mb-9">
        <div className="mb-1 ml-3">Wallet Address</div>
        <WalletSelector selectedItem={wallet} onSelect={setWallet} />
      </div>

      <div className="mb-9">
        <div className="mb-1 ml-3">Amount</div>
        <TextBox
          type="tel"
          value={String(amount)}
          filter={toAmount}
          onChange={setAmount}
          suffix={wallet?.symbol.name}
          error={amountError}
        />
      </div>

      <div className="mb-9">
        <MultiButton
          options={['Min', '50%', 'Max']}
          onClick={autoAmountHandler}
        />
      </div>

      <div className="mb-9">
        <InfoLabel
          label="Available"
          value={available}
          unit={wallet?.symbol.name}
        />
        <InfoLabel
          label="Min. Withdrawal"
          value={minWithdrawable}
          unit={wallet?.symbol.name}
        />
        <InfoLabel label="Network-Fee" value={fee} unit={wallet?.symbol.name} />
      </div>

      <div className="flex justify-center">
        <Button
          className="basis-1/2"
          variant="primary"
          onClick={withdrawHandler}
          disabled={Boolean(
            !wallet?.symbol.name ||
              !wallet?.network?.name ||
              !wallet ||
              !amount ||
              amountError,
          )}
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
};

export default ModalWithdraw;
