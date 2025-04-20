import { useState } from 'react';
import { useLastPriceQuery, useSupportedNetworks } from 'api';
import {
  useAccountBalance,
  useSupportedQuotesSymbols,
  type AutoTraderSupportedQuotes,
} from 'api/chains';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as WalletIcon } from 'modules/base/wallet/wallet-icon.svg';
import { Coin } from 'shared/Coin';
import { useSymbolInfo } from 'api/symbol';
import AmountInputBox from 'shared/AmountInputBox';
import { Toggle } from 'shared/Toggle';
import { CoinSelect } from 'shared/CoinSelect';
import { roundSensible } from 'utils/numbers';
import Spin from 'shared/Spin';
import BtnSwapPlaces from './BtnSwapPlaces';

const NET_ABR = {
  'solana': 'SOL',
  'the-open-network': 'TON',
};

const QuickSwapForm: React.FC<{
  slug: string;
  quote: AutoTraderSupportedQuotes;
  setQuote: (newVal: AutoTraderSupportedQuotes) => void;
  className?: string;
}> = ({ slug, quote, setQuote }) => {
  const [dir, setDir] = useState<'buy' | 'sell'>('buy');
  const { data: baseInfo } = useSymbolInfo(slug);
  const { data: quoteInfo } = useSymbolInfo(quote);
  const [isMarketPrice, setIsMarketPrice] = useState(true);
  const [price, setPrice] = useState('5');
  const [quoteAmount, setQuoteAmount] = useState('100');
  const [baseAmount, setBaseAmount] = useState('100');
  const networks = useSupportedNetworks(slug, quote);
  const selectedNet = networks?.[0] ?? 'solana';
  const selectedNetAbr = NET_ABR[selectedNet];

  const { data: quoteBalance } = useAccountBalance(quote, selectedNet);

  const { data: assetPriceByQuote } = useLastPriceQuery({
    slug,
    quote,
    convertToUsd: false,
  });

  const { data: assetPrice } = useLastPriceQuery({
    slug,
    quote,
    convertToUsd: true,
  });

  const { data: quotePrice } = useLastPriceQuery({
    slug: quote,
    convertToUsd: true,
  });

  const quoteFields = {
    balance: quoteBalance,
    coin: quote as string,
    coinInfo: quoteInfo,
    setCoin: setQuote,
    useCoinList: useSupportedQuotesSymbols,
    amount: quoteAmount,
    setAmount: setQuoteAmount,
    price: quotePrice,
    priceByOther:
      assetPriceByQuote === undefined ? undefined : 1 / assetPriceByQuote,
  };
  const baseFields = {
    balance: 0,
    coin: slug,
    coinInfo: baseInfo,
    setCoin: undefined,
    useCoinList: undefined,
    amount: baseAmount,
    setAmount: setBaseAmount,
    price: assetPrice,
    priceByOther: assetPriceByQuote,
  };

  const from = dir === 'buy' ? quoteFields : baseFields;
  const to = dir === 'buy' ? baseFields : quoteFields;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-stretch">
        <div className="rounded-lg bg-v1-surface-l3 p-3">
          <div className="flex justify-between text-xs text-v1-content-secondary">
            <div>From {selectedNetAbr}</div>
            <div className="flex items-center gap-1">
              <WalletIcon /> {from.balance}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="grow">
              {from.setCoin ? (
                <CoinSelect
                  value={from.coin}
                  onChange={v =>
                    v && from.setCoin(v as AutoTraderSupportedQuotes)
                  }
                  className="!pl-0"
                  useCoinList={from.useCoinList}
                  noSearch
                />
              ) : (
                from.coinInfo && <Coin nonLink coin={from.coinInfo} />
              )}
            </div>
            <div className="flex flex-col items-end">
              <AmountInputBox
                noSuffixPad
                value={from.amount}
                onChange={from.setAmount}
                max={from.balance || 0}
                className="!w-auto text-2xl"
                inputClassName="!pr-0 text-end leading-none !h-[1.5rem]"
              />
              <div className="text-xs text-v1-content-secondary">
                {/* Total Quote in Dollar */}
                {from.price ? (
                  '$' + roundSensible(from.price * +from.amount)
                ) : (
                  <Spin />
                )}
              </div>
            </div>
          </div>
        </div>

        <BtnSwapPlaces
          className="relative z-10 -my-3"
          onClick={() => setDir(dir => (dir === 'buy' ? 'sell' : 'buy'))}
        />

        <div className="rounded-lg bg-v1-surface-l3 p-3">
          <div className="flex justify-between text-xs text-v1-content-secondary">
            <div>To {selectedNetAbr}</div>
            <div className="flex items-center gap-1">Estimated Amount</div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="grow">
              {to.setCoin ? (
                <CoinSelect
                  value={to.coin}
                  onChange={v =>
                    v && to.setCoin(v as AutoTraderSupportedQuotes)
                  }
                  className="!pl-0"
                  useCoinList={to.useCoinList}
                  noSearch
                />
              ) : (
                to.coinInfo && <Coin nonLink coin={to.coinInfo} />
              )}
            </div>
            <div className="flex flex-col items-end text-v1-content-secondary">
              {isMarketPrice ? (
                <div className="text-2xl leading-none">
                  {/* Total assets in Quote */}
                  {to.priceByOther ? (
                    roundSensible(+to.amount / to.priceByOther)
                  ) : (
                    <Spin />
                  )}
                </div>
              ) : (
                <AmountInputBox
                  noSuffixPad
                  value={to.amount}
                  onChange={to.setAmount}
                  className="!w-auto text-2xl"
                  inputClassName="id-second-input !pr-0 text-v1-content-primary text-end leading-none !h-[1.5rem]"
                />
              )}
              <div className="text-xs">
                {/* Total assets in Dollar */}
                {to.price && to.priceByOther ? (
                  '$' + roundSensible((to.price * +to.amount) / to.priceByOther)
                ) : (
                  <Spin />
                )}
              </div>
            </div>
          </div>

          <div className="my-3 w-full border-t border-v1-surface-l4" />
          <div className="flex items-center justify-between">
            <div className="text-v1-content-secondary">
              {to.priceByOther ? (
                <>
                  1 {quoteInfo?.abbreviation} ≈{' '}
                  {roundSensible(1 / to.priceByOther)}{' '}
                  {to.coinInfo?.abbreviation}
                </>
              ) : (
                <Spin />
              )}
            </div>

            <div className="flex items-center gap-1">
              Market Price
              <Toggle
                checked={isMarketPrice}
                onChange={setIsMarketPrice}
                variant="brand"
              />
            </div>
          </div>

          {!isMarketPrice && (
            <>
              <div className="my-3 w-full border-t border-v1-surface-l4" />
              <div className="text-v1-content-secondary">
                % Under the Market Price (Stop Market)
              </div>
              <AmountInputBox value={price} onChange={setPrice} suffix="%" />
            </>
          )}
        </div>
      </div>
      <div className="min-h-8 grow" />
      <Button variant="primary">Swap</Button>
    </div>
  );
};

export default QuickSwapForm;
