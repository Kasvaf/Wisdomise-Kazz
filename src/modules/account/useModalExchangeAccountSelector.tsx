import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useExchangeAccountsQuery, type ExchangeAccount } from 'api';
import { type MarketTypes } from 'api/types/financialProduct';
import useModal from 'shared/useModal';
import Button from 'shared/Button';
import WisdomiseLogoSvg from 'assets/logo-horizontal-beta.svg';
import BinanceLogoSvg from 'assets/logo-binance.svg';
import ComboBox from 'modules/shared/ComboBox';
import useModalAddExchangeAccount from './useModalAddExchangeAccount';

const exchangeIcons = {
  WISDOMISE: WisdomiseLogoSvg,
  BINANCE: BinanceLogoSvg,
};

const ExchangeAccountOptionItem = (item: ExchangeAccount | string) => {
  if (typeof item === 'string') return <div>{item}</div>;

  const ExchangeIcon = exchangeIcons[item.exchange_name];
  return (
    <div className="flex items-center">
      <div className="mr-4 basis-1/2 border-r border-r-white/20 pr-4 text-xs">
        {item.title}
      </div>
      <div className="basis-1/2">
        <img src={ExchangeIcon} />
      </div>
    </div>
  );
};

interface Props {
  market?: MarketTypes;
  label?: string;
  className?: string;
  selectedItem: string;
  onSelect?: (net: string) => void;
  disabled?: boolean;
}

const ExchangeAccountSelector: React.FC<Props> = ({
  market,
  label,
  className,
  selectedItem,
  onSelect,
  disabled = false,
}) => {
  const { data, isLoading } = useExchangeAccountsQuery();

  const items: ExchangeAccount[] = useMemo(() => {
    const wisdomise = {
      key: 'wisdomise',
      exchange_name: 'WISDOMISE' as const,
      market_name: 'SPOT' as const,
      status: 'INACTIVE' as const,
      title: 'Wisdomise Account',
    };

    return market
      ? [
          wisdomise,
          {
            ...wisdomise,
            market_name: 'FUTURES' as const,
          },
          ...(data ?? []),
        ].filter(acc => acc.status === 'INACTIVE' && acc.market_name === market)
      : [wisdomise];
  }, [data, market]);

  return (
    <div className={className}>
      {label && <label className="mb-2 ml-4 block">{label}</label>}

      <ComboBox
        options={items}
        selectedItem={
          market && isLoading
            ? 'loading...'
            : items.find(x => x.key === selectedItem)
        }
        onSelect={acc => onSelect?.(acc.key)}
        renderItem={ExchangeAccountOptionItem}
        disabled={disabled}
      />
    </div>
  );
};

const ModalExchangeAccountSelector: React.FC<{
  market?: MarketTypes;
  onResolve?: (account?: string) => void;
}> = ({ market, onResolve }) => {
  const { t } = useTranslation('external-accounts');
  const [account, setAccount] = useState('wisdomise');

  const [ModalAddExchange, showAddExchange] =
    useModalAddExchangeAccount(market);

  const connectHandler = async () => {
    const addedAcc = await showAddExchange();
    if (addedAcc) setAccount(addedAcc);
  };

  return (
    <div className="text-white">
      <h1 className="mb-6 text-center text-xl">
        {t('modal-account-selector.title')}
      </h1>
      <div>
        <ExchangeAccountSelector
          label="Account"
          market={market}
          selectedItem={account}
          onSelect={setAccount}
        />

        {!market && (
          <div className="mt-2 flex items-center justify-center text-xs text-white/20">
            {t('modal-account-selector.not-supported')}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-stretch gap-4">
        {market && (
          <Button onClick={connectHandler}>
            {t('modal-account-selector.btn-connect-new')}
          </Button>
        )}

        <Button className="grow" onClick={() => onResolve?.(account)}>
          {t('modal-account-selector.btn-continue')}
        </Button>
      </div>
      {ModalAddExchange}
    </div>
  );
};

export default function useModalExchangeAccountSelector(): [
  JSX.Element,
  (p: { market?: MarketTypes }) => Promise<string | undefined>,
] {
  const [Modal, showModal] = useModal(ModalExchangeAccountSelector);
  return [
    Modal,
    async (p: { market?: MarketTypes }) =>
      (await showModal(p)) as string | undefined,
  ];
}
