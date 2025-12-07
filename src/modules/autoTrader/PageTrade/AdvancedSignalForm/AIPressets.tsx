import { type OrderPresetItem, useAIPresets } from 'api/ai-presets';
import { ReactComponent as LogoIcon } from 'assets/monogram-green.svg';
import { bxChevronDown } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useActiveNetwork } from 'modules/base/active-network';
import { useEffect, useState } from 'react';
import Button from 'shared/Button';
import { DrawerModal } from 'shared/DrawerModal';
import Icon from 'shared/Icon';
import usePageTour from 'shared/usePageTour';
import { roundSensible } from 'utils/numbers';
import { v4 } from 'uuid';
import { ReactComponent as StarIcon } from './StarIcon.svg';
import type { SignalFormState, TpSlData } from './useSignalFormStates';

const orderToOrder = (x: OrderPresetItem, ind?: number) => ({
  amountRatio: roundSensible(x.amount * 100),
  priceExact: String(x.price),
  applied: false,
  removed: false,
  isMarket: ind === 0,
  key: v4(),
});

const fromApi = (items?: OrderPresetItem[]) => {
  const result: TpSlData[] = [];
  if (!items?.length) return result;

  let prevSum = 0;
  for (const x of items) {
    const amount = x.amount * (1 - prevSum);
    prevSum += amount;
    result.push(orderToOrder({ amount, price: x.price }));
  }
  return result;
};

const AIPresets: React.FC<{
  data: SignalFormState;
  baseSlug: string;
  quoteSlug: string;
  noManual?: boolean;
}> = ({ data, baseSlug, quoteSlug, noManual }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState(3);
  const net = useActiveNetwork();
  const { data: presets, isLoading } = useAIPresets(
    `${baseSlug}/${quoteSlug}`,
    net,
  );

  const {
    isUpdate: [isUpdate],
    safetyOpens: [safetyOpens, setSafetyOpens],
    takeProfits: [takeProfits, setTakeProfits],
    stopLosses: [stopLosses, setStopLosses],
  } = data;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    setActivePreset(activePreset < 0 ? -activePreset - 1 : 3);
  }, [safetyOpens, takeProfits, stopLosses]);

  const tourSelector = 'id-tour-ai-preset';
  usePageTour({
    key: 'ai-preset-tour',
    enabled: !isUpdate && !isLoading && !!presets?.length,
    steps: [
      {
        selector: `.${tourSelector}`,
        content: (
          <>
            <div className="font-semibold">Save time with AI Presets:</div>
            <div>
              Get smart, pre-filled setups for entries, take-profits, and
              stop-losses—customized for each coin.
            </div>
          </>
        ),
      },
    ],
  });

  if (!presets && !isLoading) {
    return <></>;
  }

  const reset = () => {
    setIsOpen(false);
    setActivePreset(3);
    setSafetyOpens([
      {
        amountRatio: '100',
        applied: false,
        isMarket: true,
        removed: false,
        priceExact: '',
        key: v4(),
      },
    ]);
    setTakeProfits([]);
    setStopLosses([]);
  };

  const selectVariant = (ind: number) => {
    if (!presets) return;

    setIsOpen(false);
    if (ind >= presets.length || ind < 0) {
      setActivePreset(3);
      return;
    }

    const p = presets[ind].preset;
    setSafetyOpens(p.open_orders.map(orderToOrder));
    setTakeProfits(fromApi(p.take_profits));
    setStopLosses(fromApi(p.stop_losses));
    setActivePreset(-ind - 1);
  };

  if (isUpdate) return null;

  return (
    <div
      className={clsx(
        'overflow-hidden rounded-xl bg-cover bg-v1-surface-l1 p-3',
        tourSelector,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoIcon className="h-4 w-4" />
          <div className="font-normal text-xs">GoatX AI Preset</div>
        </div>

        <Button
          className="!h-6 !px-4 !py-0 text-2xs"
          loading={isLoading}
          onClick={() => setIsOpen(true)}
          variant={isLoading ? 'alternative' : 'primary'}
        >
          {isLoading
            ? 'Loading Presets'
            : (presets?.[activePreset]?.label ??
              (noManual ? 'Select Preset' : 'Manual'))}
          <Icon name={bxChevronDown} size={16} />
        </Button>

        <StarIcon />
      </div>

      {presets && (
        <DrawerModal
          onClose={() => setIsOpen(false)}
          open={isOpen}
          title={
            <div className="flex items-center gap-4">
              {!noManual && (
                <Button
                  className="!py-2"
                  onClick={reset}
                  size="small"
                  variant="alternative"
                >
                  Reset
                </Button>
              )}
              GoatX AI Preset
            </div>
          }
          width={400}
        >
          <div className="mb-10 flex flex-col items-stretch gap-4">
            {presets.map((p, ind) => (
              <Button
                className="!p-3 h-12"
                contentClassName="!text-base"
                key={p.label}
                onClick={() => selectVariant(ind)}
                variant={activePreset === ind ? 'primary' : 'secondary'}
              >
                {p.label}
              </Button>
            ))}
            {!noManual && (
              <Button
                className="!p-3 h-12"
                contentClassName="!text-base"
                onClick={() => selectVariant(presets.length)}
                variant={
                  activePreset === presets.length ? 'primary' : 'secondary'
                }
              >
                Manual
              </Button>
            )}
          </div>
        </DrawerModal>
      )}
    </div>
  );
};

export default AIPresets;
