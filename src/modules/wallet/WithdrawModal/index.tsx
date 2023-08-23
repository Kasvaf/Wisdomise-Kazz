/* eslint-disable import/max-dependencies */
import * as numerable from 'numerable';
import { useCallback, useRef, useState } from 'react';
import { notification } from 'antd';
import {
  useConfirmWithdrawMutation,
  useCreateWithdrawMutation,
  useInvestorAssetStructuresQuery,
  useResendWithdrawEmailMutation,
} from 'api';
import { roundDown } from 'utils/numbers';
import Spinner from 'shared/Spinner';
import TextBox from 'shared/TextBox';
import Button from 'shared/Button';
import MultiButton from 'shared/MultiButton';
import { unwrapErrorMessage } from 'utils/error';
import useCryptoNetworkSelector from '../useCryptoNetworkSelector';
import useWithdrawalConfirm from './useWithdrawalConfirm';
import useWithdrawSuccess from './useWithdrawSuccess';
import useNetworkConfirm from './useNetworkConfirm';
import useSecurityInput from './useSecurityInput';

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
    .replace(/^(\d+(\.\d*))\..*$/, '$1');

const WithdrawModal: React.FC<{ onResolve?: () => void }> = ({ onResolve }) => {
  const ias = useInvestorAssetStructuresQuery();
  const mea = ias.data?.[0]?.main_exchange_account;
  const {
    component: CryptoNetworkSelector,
    loading: cryptoNetLoading,
    crypto,
    network,
  } = useCryptoNetworkSelector({ usage: 'withdrawable' });

  const minWithdrawable = +(network?.binance_info?.withdrawMin ?? 0);
  const available = mea?.quote_equity ? roundDown(mea.quote_equity) : 0;
  const fee = +(network?.binance_info?.withdrawFee ?? 0);

  // ----------------------------------------------------

  const [wallet, setWallet] = useState('');
  const [amount, setAmount] = useState('0');
  const walletValid =
    !wallet ||
    !network.binance_info?.addressRegex ||
    wallet.match(network.binance_info.addressRegex);
  const amountValid =
    Number.parseFloat(amount) >= minWithdrawable &&
    Number.parseFloat(amount) <= available;

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
    crypto,
    network,
    amount: Number.parseFloat(amount),
    wallet,
    fee,
    source: mea?.exchange_market.market.name || '',
  };
  const [ConfirmNetworkModal, openConfirmNetwork] = useNetworkConfirm(network);
  const [ConfirmWithdrawalModal, openConfirmWithdrawal] =
    useWithdrawalConfirm(withdrawInfo);
  const [WithdrawSuccessModal, showSuccess] = useWithdrawSuccess(withdrawInfo);

  const createWithdraw = useCreateWithdrawMutation();
  const doCreateWithdraw = useCallback(async () => {
    const exchangeAccountKey = ias.data?.[0]?.main_exchange_account.key;
    if (!exchangeAccountKey) throw new Error('unexpected');
    return await createWithdraw({
      tx_type: 'WITHDRAW',
      symbol_name: crypto.name,
      network_name: network.name,
      address: wallet,
      amount,
      exchangeAccountKey,
    });
  }, [amount, createWithdraw, crypto.name, ias.data, network.name, wallet]);

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
      {CryptoNetworkSelector}

      <div className="mb-9">
        <div className="mb-1 ml-3">Wallet Address</div>
        <TextBox value={wallet} onChange={setWallet} hasError={!walletValid} />
      </div>

      <div className="mb-9">
        <div className="mb-1 ml-3">Amount</div>
        <TextBox
          type="tel"
          value={String(amount)}
          filter={toAmount}
          onChange={setAmount}
          suffix={crypto.name}
          hasError={!amountValid}
        />
      </div>

      <div className="mb-9">
        <MultiButton
          options={['Min', '50%', 'Max']}
          onClick={autoAmountHandler}
        />
      </div>

      {cryptoNetLoading ? (
        <div className="flex justify-center py-2">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="mb-9">
            <InfoLabel label="Available" value={available} unit={crypto.name} />
            <InfoLabel
              label="Min. Withdrawal"
              value={minWithdrawable}
              unit={crypto.name}
            />
            <InfoLabel label="Network-Fee" value={fee} unit={crypto.name} />
          </div>

          <div className="flex justify-center">
            <Button
              className="basis-1/2"
              variant="primary"
              onClick={withdrawHandler}
              disabled={
                !walletValid ||
                !wallet ||
                !amountValid ||
                !crypto.name ||
                !network.key
              }
            >
              Withdraw
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default WithdrawModal;
