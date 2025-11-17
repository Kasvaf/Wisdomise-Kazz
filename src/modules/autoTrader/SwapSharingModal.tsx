import { ReactComponent as Logo } from 'assets/logo-white.svg';
import { bxImage } from 'boxicons-quasar';
import { BtnConvertToUsd, SolanaIcon } from 'modules/autoTrader/TokenActivity';
import { useRef, useState } from 'react';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import ReferralQrCode from 'shared/ShareTools/ReferralQrCode';
import SharingModal from 'shared/ShareTools/SharingModal';
import { Button } from 'shared/v1-components/Button';
import { Token } from 'shared/v1-components/Token';
import bg1 from './images/1.jpg';
import bg2 from './images/2.jpg';
import bg3 from './images/3.jpg';

const backgrounds = [bg1, bg2, bg3];

export default function SwapSharingModal({
  open,
  onClose,
  tokenAddress,
  slug,
  pnlPercent,
  pnlUsdPercent,
  pnl,
  pnlUsd,
  bought,
  boughtUsd,
  sold,
  soldUsd,
}: {
  open: boolean;
  tokenAddress?: string;
  slug?: string;
  pnlPercent?: number;
  pnl?: number;
  bought?: number;
  sold?: number;
  pnlUsdPercent?: number;
  pnlUsd?: number;
  boughtUsd?: number;
  soldUsd?: number;
  onClose: () => void;
}) {
  const [convertToUsd, setConvertToUsd] = useState(false);
  const el = useRef<HTMLDivElement>(null);
  const [bg, setBg] = useState(Math.floor(Math.random() * backgrounds.length));

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
          className="flex w-[35rem] flex-col items-start overflow-hidden rounded-xl bg-v1-surface-l2 [&.capturing_[data-nocapture]]:hidden"
          ref={el}
        >
          <div className="relative">
            <img
              alt=""
              className="size-full object-cover"
              src={backgrounds[bg]}
            />
            <div className="absolute top-3 right-3 flex gap-2" data-nocapture>
              <HoverTooltip title="Change Background">
                <Button
                  className="text-v1-content-primary/70"
                  fab
                  onClick={() => setBg(prev => (prev + 1) % backgrounds.length)}
                  size="xs"
                  variant="ghost"
                >
                  <Icon name={bxImage} />
                </Button>
              </HoverTooltip>
              <HoverTooltip title="Change Currency">
                <BtnConvertToUsd
                  isUsd={convertToUsd}
                  onChange={setConvertToUsd}
                  size="xs"
                />
              </HoverTooltip>
            </div>
            <div className="absolute top-0 p-6">
              <Logo className="h-8 w-auto" />
              <Token
                address={tokenAddress}
                autoFill
                className="my-6"
                link={false}
                noCors={true}
                showAddress={false}
                slug={slug}
                truncate={false}
              />
              <DirectionalNumber
                className="!flex justify-start text-3xl"
                suffix="%"
                value={convertToUsd ? pnlUsdPercent : pnlPercent}
              />
              <div className="mb-4 flex items-center">
                {!convertToUsd && <SolanaIcon className="mr-1" noCors={true} />}
                <DirectionalNumber
                  prefix={convertToUsd ? '$' : undefined}
                  showIcon={false}
                  showSign={true}
                  value={convertToUsd ? pnlUsd : pnl}
                />
              </div>

              <div className="min-w-36 space-y-1 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-white/70">Bought</span>
                  <div className="flex items-center">
                    {!convertToUsd && (
                      <SolanaIcon className="mr-1" noCors={true} />
                    )}
                    <ReadableNumber
                      label={convertToUsd ? '$' : undefined}
                      value={convertToUsd ? boughtUsd : bought}
                    />
                  </div>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-white/70">Sold</span>
                  <div className="flex items-center">
                    {!convertToUsd && (
                      <SolanaIcon className="mr-1" noCors={true} />
                    )}
                    <ReadableNumber
                      label={convertToUsd ? '$' : undefined}
                      value={convertToUsd ? soldUsd : sold}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ReferralQrCode className="w-full p-6" />
        </div>
      </div>
    </SharingModal>
  );
}
