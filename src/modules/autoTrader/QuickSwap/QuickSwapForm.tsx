import { type AutoTraderSupportedQuotes } from 'api/chains';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as WalletIcon } from 'modules/base/wallet/wallet-icon.svg';
import { Coin } from 'shared/Coin';
import AmountInputBox from 'shared/AmountInputBox';
import { Toggle } from 'shared/Toggle';
import { CoinSelect } from 'shared/CoinSelect';
import { roundSensible } from 'utils/numbers';
import Spin from 'shared/Spin';
import BtnSwapPlaces from './BtnSwapPlaces';
import { type SwapState } from './useSwapState';
import useActionHandlers from './useActionHandlers';

const NET_ABR = {
  'solana': 'SOL',
  'the-open-network': 'TON',
};

const QuickSwapForm: React.FC<{
  state: SwapState;
  className?: string;
}> = ({ state }) => {
  const {
    selectedNet,
    dir,
    from,
    to,
    swapFromTo,
    isMarketPrice,
    setIsMarketPrice,
  } = state;
  const selectedNetAbr = NET_ABR[selectedNet];
  const { ModalApproval, firePosition, isEnabled, isSubmitting } =
    useActionHandlers(state);
  const targetReady = from.priceByOther !== undefined;
  const marketToAmount = +from.amount * Number(from.priceByOther);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-stretch">
        <div className="rounded-lg bg-v1-surface-l3 p-3">
          <div className="flex justify-between text-xs text-v1-content-secondary">
            <div>From {selectedNetAbr}</div>
            <div
              className="flex items-center gap-1"
              onClick={() =>
                from.balance && from.setAmount(String(from.balance))
              }
            >
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

        <BtnSwapPlaces className="relative z-10 -my-3" onClick={swapFromTo} />

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
                  {targetReady ? roundSensible(marketToAmount) : <Spin />}
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
                {to.price && targetReady ? (
                  '$' + roundSensible(marketToAmount * to.price)
                ) : (
                  <Spin />
                )}
              </div>
            </div>
          </div>

          <div className="my-3 w-full border-t border-v1-surface-l4" />
          <div className="flex items-center justify-between">
            <div className="text-v1-content-secondary">
              {from.priceByOther && to.amount && from.amount ? (
                <>
                  1 {from.coinInfo?.abbreviation} ≈{' '}
                  {roundSensible(
                    isMarketPrice
                      ? from.priceByOther
                      : +to.amount / +from.amount,
                  )}{' '}
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
                onChange={v => {
                  setIsMarketPrice(v);
                  if (!v && targetReady) {
                    to.setAmount(roundSensible(marketToAmount));
                  }
                }}
                variant="brand"
              />
            </div>
          </div>

          {!isMarketPrice && (
            <>
              <div className="my-3 w-full border-t border-v1-surface-l4" />
              <div className="text-v1-content-secondary">
                % {+to.amount < marketToAmount ? 'Under' : 'Over'} the Market
                Price (Stop Market)
              </div>
              <AmountInputBox
                value={String(
                  Math.round(
                    10_000 * Math.abs(+to.amount / marketToAmount - 1),
                  ) / 100,
                )}
                onChange={newVal =>
                  to.setAmount(
                    roundSensible(
                      (((dir === 'buy' ? -1 : 1) * +newVal) / 100 + 1) *
                        marketToAmount,
                    ),
                  )
                }
              />
            </>
          )}
        </div>
      </div>
      <div className="min-h-8 grow" />
      <Button
        variant="primary"
        loading={isSubmitting}
        disabled={!isEnabled}
        onClick={firePosition}
      >
        Swap
      </Button>
      {ModalApproval}
    </div>
  );
};

export default QuickSwapForm;
