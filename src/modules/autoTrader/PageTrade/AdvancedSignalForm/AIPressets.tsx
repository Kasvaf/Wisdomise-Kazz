import { v4 } from 'uuid';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { bxChevronDown } from 'boxicons-quasar';
import { roundSensible } from 'utils/numbers';
import { type OrderPresetItem, useAIPresets } from 'api/ai-presets';
import { DrawerModal } from 'shared/DrawerModal';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import usePageTour from 'shared/usePageTour';
import { useActiveNetwork } from 'modules/base/active-network';
import { type TpSlData, type SignalFormState } from './useSignalFormStates';
import { ReactComponent as LogoIcon } from './wisdomise-ai.svg';
import { ReactComponent as StarIcon } from './StarIcon.svg';
import GradientBG from './GradientBG.svg';

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
    baseSlug + '/' + quoteSlug,
    net,
  );

  const {
    isUpdate: [isUpdate],
    safetyOpens: [safetyOpens, setSafetyOpens],
    takeProfits: [takeProfits, setTakeProfits],
    stopLosses: [stopLosses, setStopLosses],
  } = data;

  useEffect(() => {
    setActivePreset(activePreset < 0 ? -activePreset - 1 : 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safetyOpens, takeProfits, stopLosses]);

  const tourSelector = 'id-tour-ai-preset';
  usePageTour({
    key: 'ai-preset-tour',
    enabled: !isUpdate && !isLoading && !!presets?.length,
    steps: [
      {
        selector: '.' + tourSelector,
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
        'overflow-hidden rounded-xl bg-v1-surface-l2 bg-cover p-3',
        tourSelector,
      )}
      style={{ backgroundImage: `url(${GradientBG})` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoIcon className="h-6 w-6" />
          <div className="text-xs font-normal">Wisdomise AI Preset</div>
        </div>

        <Button
          className="!h-6 !px-4 !py-0 text-xxs"
          onClick={() => setIsOpen(true)}
          loading={isLoading}
          variant={isLoading ? 'alternative' : 'primary'}
        >
          {isLoading
            ? 'Loading Presets'
            : presets?.[activePreset]?.label ??
              (noManual ? 'Select Preset' : 'Manual')}
          <Icon name={bxChevronDown} size={16} />
        </Button>

        <StarIcon />
      </div>

      {presets && (
        <DrawerModal
          title={
            <div className="flex items-center gap-4">
              {!noManual && (
                <Button
                  size="small"
                  variant="alternative"
                  onClick={reset}
                  className="!py-2"
                >
                  Reset
                </Button>
              )}
              Wisdomise AI Preset
            </div>
          }
          open={isOpen}
          onClose={() => setIsOpen(false)}
          width={400}
        >
          <div className="mb-10 flex flex-col items-stretch gap-4">
            {presets.map((p, ind) => (
              <Button
                key={p.label}
                variant={activePreset === ind ? 'primary' : 'secondary'}
                className="h-12 !p-3"
                contentClassName="!text-base"
                onClick={() => selectVariant(ind)}
              >
                {p.label}
              </Button>
            ))}
            {!noManual && (
              <Button
                variant={
                  activePreset === presets.length ? 'primary' : 'secondary'
                }
                className="h-12 !p-3"
                contentClassName="!text-base"
                onClick={() => selectVariant(presets.length)}
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
