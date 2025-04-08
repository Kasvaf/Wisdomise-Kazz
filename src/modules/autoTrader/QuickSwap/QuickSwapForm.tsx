import { useState } from 'react';
import { type Position } from 'api';
import { type AutoTraderSupportedQuotes } from 'api/chains';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as WalletIcon } from 'modules/base/wallet/wallet-icon.svg';
import { Coin } from 'shared/Coin';
import { useSymbolInfo } from 'api/symbol';
import AmountInputBox from 'shared/AmountInputBox';
import { Toggle } from 'shared/Toggle';

const QuickSwapForm: React.FC<{
  slug: string;
  quote?: string;
  setQuote: (newVal: AutoTraderSupportedQuotes) => void;

  activePosition?: Position;
  className?: string;
}> = ({ slug }) => {
  const { data } = useSymbolInfo(slug);
  const [isMarketPrice, setIsMarketPrice] = useState(true);
  const [price, setPrice] = useState('5');

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-stretch gap-3">
        <div className="rounded-lg bg-v1-surface-l3 p-3">
          <div className="flex justify-between text-xs text-v1-content-secondary">
            <div>From TON</div>
            <div className="flex items-center gap-1">
              <WalletIcon /> 495
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>{data && <Coin coin={data} />}</div>
            <div className="flex flex-col items-end">
              <AmountInputBox
                noSuffixPad
                value="100"
                className="!w-auto text-2xl"
                inputClassName="!pr-0 text-end leading-none !h-[1.5rem]"
              />
              <div className="text-xs text-v1-content-secondary">$378</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-v1-surface-l3 p-3">
          <div className="flex justify-between text-xs text-v1-content-secondary">
            <div>To TON</div>
            <div className="flex items-center gap-1">Estimated Amount</div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>{data && <Coin coin={data} />}</div>
            <div className="flex flex-col items-end text-v1-content-secondary">
              {isMarketPrice ? (
                <div className="text-2xl leading-none">126387.62</div>
              ) : (
                <AmountInputBox
                  noSuffixPad
                  value="100"
                  className="!w-auto text-2xl"
                  inputClassName="!pr-0 text-v1-content-primary text-end leading-none !h-[1.5rem]"
                />
              )}
              <div className="text-xs">$378</div>
            </div>
          </div>

          <div className="my-3 w-full border-t border-v1-surface-l4" />
          <div className="flex items-center justify-between">
            <div className="text-v1-content-secondary">
              1 TON ≈ 1271.074 NOT
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
