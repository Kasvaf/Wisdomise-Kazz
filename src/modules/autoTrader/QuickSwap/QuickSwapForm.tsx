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
  const networks = useSupportedNetworks(slug, quote);
  const selectedNet = networks?.[0] ?? 'solana';
  const [fromAmount, setFromAmount] = useState('100');
  const [toAmount, setToAmount] = useState('100');

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

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-stretch">
        <div className="rounded-lg bg-v1-surface-l3 p-3">
          <div className="flex justify-between text-xs text-v1-content-secondary">
            <div>From {NET_ABR[selectedNet]}</div>
            <div className="flex items-center gap-1">
              <WalletIcon /> {quoteBalance}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="grow">
              {baseInfo && (
                <CoinSelect
                  value={quote}
                  onChange={v => v && setQuote(v as AutoTraderSupportedQuotes)}
                  className="!pl-0"
                  useCoinList={useSupportedQuotesSymbols}
                  noSearch
                />
              )}
            </div>
            <div className="flex flex-col items-end">
              <AmountInputBox
                noSuffixPad
                value={fromAmount}
                onChange={setFromAmount}
                max={quoteBalance || 0}
                className="!w-auto text-2xl"
                inputClassName="!pr-0 text-end leading-none !h-[1.5rem]"
              />
              <div className="text-xs text-v1-content-secondary">
                {/* Total Quote in Dollar */}
                {quotePrice ? (
                  '$' + roundSensible(quotePrice * +fromAmount)
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
            <div>To {NET_ABR[selectedNet]}</div>
            <div className="flex items-center gap-1">Estimated Amount</div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="grow">
              {baseInfo && <Coin nonLink coin={baseInfo} />}
            </div>
            <div className="flex flex-col items-end text-v1-content-secondary">
              {isMarketPrice ? (
                <div className="text-2xl leading-none">
                  {/* Total assets in Quote */}
                  {assetPriceByQuote ? (
                    roundSensible(+fromAmount / assetPriceByQuote)
                  ) : (
                    <Spin />
                  )}
                </div>
              ) : (
                <AmountInputBox
                  noSuffixPad
                  value={toAmount}
                  onChange={setToAmount}
                  className="!w-auto text-2xl"
                  inputClassName="id-second-input !pr-0 text-v1-content-primary text-end leading-none !h-[1.5rem]"
                />
              )}
              <div className="text-xs">
                {/* Total assets in Dollar */}
                {assetPrice && assetPriceByQuote ? (
                  '$' +
                  roundSensible((assetPrice * +fromAmount) / assetPriceByQuote)
                ) : (
                  <Spin />
                )}
              </div>
            </div>
          </div>

          <div className="my-3 w-full border-t border-v1-surface-l4" />
          <div className="flex items-center justify-between">
            <div className="text-v1-content-secondary">
              {assetPriceByQuote ? (
                <>
                  1 {quoteInfo?.abbreviation} ≈{' '}
                  {roundSensible(1 / assetPriceByQuote)}{' '}
                  {baseInfo?.abbreviation}
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
