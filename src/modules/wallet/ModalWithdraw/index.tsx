/* eslint-disable import/max-dependencies */
import * as numerable from 'numerable';
import { useCallback, useRef, useState } from 'react';
import { notification } from 'antd';
import { bxInfoCircle } from 'boxicons-quasar';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { type VerifiedWallet } from 'api/kyc';
import Banner from 'modules/shared/Banner';
import useWithdrawalConfirm from './useWithdrawalConfirm';
import useWithdrawSuccess from './useWithdrawSuccess';
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
    <div className="mb-2 flex justify-between rounded-xl bg-black/10 p-2 text-xs">
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
  const { t } = useTranslation('wallet');
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
    amountError = t('modal-withdraw.error-min-amount', {
      minAmount: String(minWithdrawable),
      symbol: wallet?.symbol.name || '',
      wallet: wallet?.network?.name || '',
    });
  } else if (Number.parseFloat(amount) > available) {
    amountError = t('modal-withdraw.error-max-amount');
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
    openConfirmWithdrawal,
    confirmSecurityCode,
    doCreateWithdraw,
    showSuccess,
    onResolve,
  ]);

  if (submitting) {
    return (
      <div className="text-white">
        <h1 className="mb-6 text-center text-xl">
          {t('modal-withdraw.title')}
        </h1>
        {ConfirmWithdrawalModal}
        {SecurityInputModal}
        {WithdrawSuccessModal}
        <div className="mt-2 flex justify-center py-2">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h1 className="mb-6 text-center text-xl">{t('modal-withdraw.title')}</h1>

      <Banner icon={bxInfoCircle} className="mb-10">
        <span className="text-white/80">
          {t('modal-withdraw.banner.description')}
        </span>{' '}
        <NavLink
          to="/account/kyc"
          className="font-bold underline"
          rel="noreferrer"
          onClick={onResolve}
        >
          {t('modal-withdraw.banner.btn-verify-wallet')}
        </NavLink>
      </Banner>

      <div className="mb-9">
        <div className="mb-1 ml-3">{t('wallet-address')}</div>
        <WalletSelector selectedItem={wallet} onSelect={setWallet} />
      </div>

      <div className="mb-9">
        <div className="mb-1 ml-3">{t('amount')}</div>
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
          label={t('available')}
          value={available}
          unit={wallet?.symbol.name}
        />
        <InfoLabel
          label={t('modal-withdraw.min-withdrawal')}
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
          {t('modal-withdraw.btn-withdraw')}
        </Button>
      </div>
    </div>
  );
};

export default ModalWithdraw;
