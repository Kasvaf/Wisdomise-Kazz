import { type Dispatch, type SetStateAction, useRef, useState } from 'react';
import { bxDownload, bxLink } from 'boxicons-quasar';
import { QRCodeSVG } from 'qrcode.react';
import { DrawerModal } from 'shared/DrawerModal';
import { Toggle } from 'shared/Toggle';
import { Coin } from 'shared/Coin';
import { initialQuoteDeposit, type Position, useCoinDetails } from 'api';
import PriceChange from 'shared/PriceChange';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { useReferral } from 'modules/account/PageReferral/useReferral';
import { useScreenshot } from 'shared/useScreenshot';
import { useSocialShare } from 'shared/useSocialShare';
import { useShare } from 'shared/useShare';
import autoTrader from './images/auto-trader.png';
import logo from './images/logo.png';
import line from './images/line.svg';
import spaceship from './images/spaceship.png';
import gradient1 from './images/gradient-1.png';
import gradient2 from './images/gradient-2.png';
import logoOutline from './images/logo-outline.png';
import { ReactComponent as TelegramIcon } from './images/telegram.svg';
import { ReactComponent as XIcon } from './images/twitter.svg';
// eslint-disable-next-line import/max-dependencies
import { ReactComponent as LinkedinIcon } from './images/linkedin.svg';

const SHARE_TEXT = 'Join Wisdomise Adventure!';

export default function SharingCard({
  open,
  setOpen,
  position,
}: {
  open: boolean;
  position: Position;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [showExtra, setShowExtra] = useState(false);

  const { data: coin } = useCoinDetails({
    slug: position.base_slug ?? 'tether',
  });
  const initialDeposit = initialQuoteDeposit(position);
  const myReferralLink = useReferral();
  const el = useRef<HTMLDivElement>(null);
  const screenshot = useScreenshot(el, {
    backgroundColor: '#1D1E23', // v1-surface-l3
    fileName: 'share-me',
  });
  const { shareOnTwitter, shareOnTelegram, shareOnLinkedin } = useSocialShare();
  const [copy, content] = useShare('copy');

  return (
    <div>
      <DrawerModal
        open={open}
        onClose={() => setOpen(false)}
        maskClosable={true}
        closeIcon={null}
        rootClassName="[&_.ant-drawer-content]:!bg-transparent"
        className="[&>.ant-drawer-wrapper-body]:!bg-transparent"
      >
        <div
          ref={el}
          className="relative mb-2 overflow-hidden rounded-2xl bg-v1-surface-l1 p-5"
        >
          <img src={spaceship} alt="" className="absolute left-0 mt-10 px-10" />
          <img
            src={logoOutline}
            alt=""
            className="absolute left-0 top-0 w-4/5"
          />
          <img
            src={gradient1}
            alt=""
            className="absolute left-0 top-0 h-full w-full"
          />
          <img
            src={gradient2}
            alt=""
            className="absolute left-0 top-0 h-full w-full"
          />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <img src={autoTrader} alt="autoTrader" className="h-5" />
                <h1>Auto Trader</h1>
              </div>
              <img src={logo} alt="logo" className="h-5" />
            </div>
            <hr className="my-4 border-v1-border-primary/10" />
            <div className="flex flex-col items-start">
              {coin && (
                <Coin
                  coin={coin.symbol}
                  imageClassName="size-6"
                  nonLink={true}
                />
              )}
              <div className="my-6">
                <PriceChange
                  className="text-3xl"
                  value={Number(position.pnl)}
                />
                {showExtra && (
                  <div
                    className={
                      Number(position.pnl) >= 0
                        ? 'text-v1-content-positive'
                        : 'text-v1-content-negative'
                    }
                  >
                    {5} SOL (${1000})
                  </div>
                )}
              </div>
              <div className="w-36 text-sm">
                {showExtra && (
                  <div className="flex justify-between">
                    <span>Invest</span>
                    <span>{initialDeposit}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Entry Price</span>
                  <span>{position.entry_price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entry Price</span>
                  <span>{position.exit_price}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-8">
              <div>
                <h2 className="mb-2 inline whitespace-nowrap bg-wsdm-gradient bg-clip-text text-sm font-semibold text-transparent">
                  Ready To Dive In?
                </h2>
                <p className="text-xxs">
                  Scan the QR Code or Use the Link to Join the Wisdomise
                  Adventure!
                </p>
                <img src={line} alt="" className="my-3" />
                <img src={logo} className="h-5" alt="" />
              </div>
              <QRCodeSVG
                width={200}
                value={myReferralLink}
                bgColor="transparent"
                fgColor="white"
              />
            </div>
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between rounded-lg bg-v1-surface-l1 px-3 py-4 text-xs">
          Display Investment Amount and Profit/Loss
          <Toggle checked={showExtra} onChange={setShowExtra} />
        </div>

        <div className="rounded-2xl bg-v1-surface-l1 px-3 py-5">
          <p className="mb-3 text-xs text-v1-content-secondary">
            Download the Image and Share It on Social Media
          </p>
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2 [&>*]:bg-transparent [&>*]:px-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnTelegram(SHARE_TEXT, myReferralLink)}
              >
                <TelegramIcon />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  shareOnTwitter(SHARE_TEXT, myReferralLink, [
                    'Wisdomise',
                    'AutoTrader',
                  ])
                }
              >
                <XIcon />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnLinkedin(myReferralLink)}
              >
                <LinkedinIcon />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copy(myReferralLink)}
              >
                <Icon name={bxLink} />
              </Button>
            </div>
            <Button
              className="ml-auto"
              variant="white"
              size="sm"
              onClick={screenshot}
            >
              <Icon name={bxDownload} />
              Download
            </Button>
          </div>
        </div>
        {content}
      </DrawerModal>
    </div>
  );
}
