import * as numerable from 'numerable';
import { useCallback, useEffect, useState } from 'react';
import {
  useMarketSymbolsQuery,
  useMarketNetworksQuery,
  useInvestorAssetStructuresQuery,
} from 'api';
import Spinner from 'shared/Spinner';
import TextBox from 'modules/shared/TextBox';
import { roundDown } from 'utils/numbers';
import { Button } from 'modules/shared/Button';
import MultiButton from 'modules/shared/MultiButton';
import NetworkSelector, { type Network } from '../NetworkSelector';
import CryptoSelector from '../CryptoSelector';
import useSecurityInput from './useSecurityInput';
import useNetworkConfirm from './useNetworkConfirm';
import useWithdrawalConfirm from './useWithdrawalConfirm';
import useWithdrawSuccess from './useWithdrawSuccess';

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
        {value == null || isNaN(value)
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
    .replace(/[^\d.]+/g, '')
    .replace(/^(0+)/, '')
    .replace(/^\./, '0.')
    .replace(/^(\d+(\.\d*))\..*$/, '$1');

const WithdrawModal: React.FC<{ onResolve?: () => void }> = ({ onResolve }) => {
  const ias = useInvestorAssetStructuresQuery();
  const mea = ias.data?.[0]?.main_exchange_account;

  const [crypto, setCrypto] = useState({ name: 'loading', key: '' });
  const cryptos = useMarketSymbolsQuery('withdrawable');
  useEffect(() => {
    const cc = (cryptos.data ?? []).filter(x => x.name === mea?.quote.name);
    if (cc[0]) {
      setCrypto(cc[0]);
    }
  }, [cryptos.data, mea?.quote.name]);

  // ----------------------------------------------------

  const [net, setNet] = useState<Network>({
    name: 'loading',
    description: '',
  } as Network);
  const networks = useMarketNetworksQuery({
    usage: 'withdrawable',
    symbol: crypto.name !== 'loading' ? crypto.name : undefined,
    exchangeAccountKey: mea?.key,
  });
  useEffect(() => {
    const nets = networks.data;
    if (!nets) return;
    setNet(net => nets.find(n => n.name === net.name) || nets[0]);
  }, [networks.data]);

  const minWithdrawable = +(net?.binance_info?.withdrawMin ?? 0);
  const available = mea?.quote_equity ? roundDown(mea.quote_equity) : 0;
  const fee = +net?.binance_info?.withdrawFee;

  // ----------------------------------------------------

  const [wallet, setWallet] = useState('');
  const [amount, setAmount] = useState('0');
  const walletValid =
    !wallet ||
    !net.binance_info?.addressRegex ||
    wallet.match(net.binance_info.addressRegex);
  const amountValid = parseFloat(amount) >= minWithdrawable;

  const withdrawInfo = {
    crypto,
    network: net,
    amount: parseFloat(amount),
    wallet,
    fee,
    source: mea?.exchange_market.market.name || '',
  };

  const autoAmountHandler = useCallback(
    (opt: string) => {
      switch (opt) {
        case 'Min':
          setAmount(String(minWithdrawable));
          break;
        case '50%':
          setAmount(
            String(Math.max(Math.floor(available / 2), minWithdrawable)),
          );
          break;
        case 'Max':
          setAmount(String(Math.max(available, minWithdrawable)));
          break;
      }
    },
    [available, minWithdrawable],
  );

  const [ConfirmNetworkModal, openConfirmNetwork] = useNetworkConfirm(net);
  const [ConfirmWithdrawalModal, openConfirmWithdrawal] =
    useWithdrawalConfirm(withdrawInfo);
  const [WithdrawSuccessModal, showSuccess] = useWithdrawSuccess(withdrawInfo);

  const [SecurityInputModal, confirmSecurityCode] = useSecurityInput({
    onConfirm: (code: string) => {
      console.log('confirm');
      return new Promise((resolve, reject) =>
        setTimeout(() => reject(new Error('Wrong code, Try again')), 1000),
      );
      return Promise.reject(new Error('Wrong code, Try again'));
    },
    onResend: () => {
      console.log('resend');
    },
  });

  const withdrawHandler = useCallback(async () => {
    if (!(await openConfirmNetwork())) return;
    if (!(await openConfirmWithdrawal())) return;
    if (!(await confirmSecurityCode())) return;
    await showSuccess();
    onResolve?.();
  }, [
    openConfirmNetwork,
    openConfirmWithdrawal,
    confirmSecurityCode,
    showSuccess,
    onResolve,
  ]);

  return (
    <div className="text-white">
      <h1 className="mb-6 text-center text-xl">Deposit</h1>
      <div className="mb-9 flex justify-stretch mobile:flex-col">
        <div className="basis-1/2 mobile:mb-6">
          <div className="mb-1 ml-3">Cryptocurrency</div>
          <CryptoSelector
            cryptos={(cryptos.data ?? []).filter(
              x => x.name === mea?.quote.name,
            )}
            selectedItem={crypto}
            onSelect={setCrypto}
            disabled={cryptos.isLoading}
          />
        </div>

        <div className="w-8 mobile:hidden" />

        <div className="basis-1/2">
          <div className="mb-1 ml-3">Network</div>
          <NetworkSelector
            networks={networks.data}
            selectedItem={net}
            onSelect={setNet}
            disabled={networks.isLoading}
          />
          <ConfirmNetworkModal />
        </div>
      </div>

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
          onChange={x => setAmount(x)}
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

      {networks.isLoading || cryptos.isLoading ? (
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
                !crypto.key ||
                !net.key
              }
            >
              Withdraw
            </Button>
          </div>
        </>
      )}

      <ConfirmWithdrawalModal />
      <SecurityInputModal />
      <WithdrawSuccessModal />
    </div>
  );
};

export default WithdrawModal;
