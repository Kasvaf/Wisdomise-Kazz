import { useCallback, useState } from 'react';
import {
  useExchangeAccountsQuery,
  type ExchangeAccount,
  type MarketTypes,
} from 'api';
import useModal from 'shared/useModal';
import Button from 'shared/Button';
import { ReactComponent as WisdomiseLogoSvg } from 'assets/logo-horizontal-beta.svg';
import { ReactComponent as BinanceLogoSvg } from 'assets/logo-binance.svg';
import ComboBox from 'modules/shared/ComboBox';
import useModalAddExchangeAccount from './useModalAddExchangeAccount';

const exchangeIcons = {
  WISDOMISE: WisdomiseLogoSvg,
  BINANCE: BinanceLogoSvg,
};

const ExchangeAccountOptionItem = (item: ExchangeAccount | string) => {
  if (typeof item === 'string') return <div>{item}</div>;

  const Icon = exchangeIcons[item.exchange_name];
  return (
    <div className="flex items-center">
      <div className="mr-4 basis-1/2 border-r border-r-white/20 pr-4 text-xs">
        {item.title}
      </div>
      <div className="basis-1/2">
        <Icon />
      </div>
    </div>
  );
};

interface Props {
  market: MarketTypes;
  label?: string;
  className?: string;
  selectedItem: string;
  onSelect?: (net: string) => void;
  disabled?: boolean;
  noWisdomise?: boolean;
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
  const onSelectHandler = useCallback(
    (acc: ExchangeAccount) => onSelect?.(acc.key),
    [onSelect],
  );

  const items: ExchangeAccount[] = [
    {
      key: '',
      exchange_name: 'WISDOMISE' as const,
      market_name: 'SPOT' as const,
      status: 'INACTIVE' as const,
      title: 'Wisdomise Account',
    },
    {
      key: '',
      exchange_name: 'WISDOMISE' as const,
      market_name: 'FUTURES' as const,
      status: 'INACTIVE' as const,
      title: 'Wisdomise Account',
    },
    ...(data ?? []),
  ].filter(acc => acc.status === 'INACTIVE' && acc.market_name === market);

  return (
    <div className={className}>
      {label && <label className="mb-2 ml-4 block">{label}</label>}

      <ComboBox
        options={items}
        selectedItem={
          isLoading ? 'loading...' : items.find(x => x.key === selectedItem)
        }
        onSelect={onSelectHandler}
        renderItem={ExchangeAccountOptionItem}
        disabled={disabled}
      />
    </div>
  );
};

const ModalExchangeAccountSelector: React.FC<{
  market: MarketTypes;
  onResolve?: (account?: string) => void;
}> = ({ market, onResolve }) => {
  const [account, setAccount] = useState('');

  const [ModalAddExchange, showAddExchange] = useModalAddExchangeAccount();
  const continueHandler = useCallback(
    () => onResolve?.(account || undefined),
    [onResolve, account],
  );

  const connectHandler = useCallback(async () => {
    const addedAcc = await showAddExchange();
    if (addedAcc) setAccount(addedAcc);
  }, [showAddExchange]);

  return (
    <div className="text-white">
      <h1 className="mb-6 text-center text-xl">Select Account</h1>
      <div>
        <ExchangeAccountSelector
          label="Account"
          market={market}
          selectedItem={account}
          onSelect={setAccount}
        />
      </div>

      <div className="mt-8 flex justify-stretch gap-4">
        <Button onClick={connectHandler}>Connect New Account</Button>
        <Button className="grow" onClick={continueHandler}>
          Continue
        </Button>
      </div>
      {ModalAddExchange}
    </div>
  );
};

export default function useModalExchangeAccountSelector(): [
  JSX.Element,
  (p: { market: MarketTypes }) => Promise<string | undefined>,
] {
  const [Modal, showModal] = useModal(ModalExchangeAccountSelector);
  return [
    Modal,
    async (p: { market: MarketTypes }) =>
      (await showModal(p)) as string | undefined,
  ];
}
