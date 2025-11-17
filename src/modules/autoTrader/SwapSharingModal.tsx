import type { Swap } from 'api';
import { ReactComponent as Logo } from 'assets/logo-white.svg';
import { bxRefresh } from 'boxicons-quasar';
import { useRef, useState } from 'react';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import PriceChange from 'shared/PriceChange';
import ReferralQrCode from 'shared/ShareTools/ReferralQrCode';
import SharingModal from 'shared/ShareTools/SharingModal';
import { Button } from 'shared/v1-components/Button';
import { Token } from 'shared/v1-components/Token';
import { formatNumber } from 'utils/numbers';
import bg1 from './images/1.jpg';
import bg2 from './images/2.jpg';
import bg3 from './images/3.jpg';

const backgrounds = [bg1, bg2, bg3];

export default function SwapSharingModal({
  open,
  onClose,
  swap,
}: {
  open: boolean;
  swap: Swap;
  onClose: () => void;
}) {
  const el = useRef<HTMLDivElement>(null);
  const [bg, setBg] = useState(Math.floor(Math.random() * backgrounds.length));

  const fromTo = Number(swap.from_amount) / Number(swap.to_amount);
  const price = swap.side === 'LONG' ? fromTo : 1 / fromTo;

  return (
    <SharingModal
      fileName="pnl"
      onClose={onClose}
      open={open}
      screenshotTarget={el}
    >
      <div className="mb-2 overflow-hidden rounded-2xl bg-v1-surface-l1 p-3">
        <h2 className="mb-3">Share Result</h2>
        <div
          className="[&.capturing_[data-nocapture]]:!hidden flex w-[35rem] flex-col items-start overflow-hidden rounded-xl bg-v1-surface-l2"
          ref={el}
        >
          <div className="relative">
            <img
              alt=""
              className="size-full object-cover"
              src={backgrounds[bg]}
            />
            <HoverTooltip
              className="!absolute top-3 right-3"
              title="Change Background"
            >
              <Button
                data-nocapture
                fab
                onClick={() => setBg(prev => (prev + 1) % backgrounds.length)}
                size="xs"
                variant="ghost"
              >
                <Icon name={bxRefresh} />
              </Button>
            </HoverTooltip>
            <div className="absolute top-0 p-6">
              <Logo className="h-8 w-auto" />
              <Token
                autoFill
                className="my-8"
                link={false}
                showAddress={false}
                slug={swap.base_slug}
                truncate={false}
              />
              <PriceChange
                className="!flex mb-4 justify-start text-3xl"
                value={Number(swap.pnl_usd_percent)}
              />

              <div className="w-36 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-white/70">Price</span>
                  <span>
                    {formatNumber(price, {
                      decimalLength: 2,
                      minifyDecimalRepeats: true,
                      separateByComma: false,
                      compactInteger: false,
                    })}{' '}
                    SOL
                  </span>
                </div>
              </div>
            </div>
          </div>
          <ReferralQrCode className="w-full px-6 py-3" />
        </div>
      </div>
    </SharingModal>
  );
}
