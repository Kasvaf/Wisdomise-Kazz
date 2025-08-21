import logo from 'assets/logo-white.svg';
import { clsx } from 'clsx';
import { useReferral } from 'modules/account/PageReferral/useReferral';
import { QRCodeSVG } from 'qrcode.react';
import line from 'shared/ShareTools/images/line.svg';

export default function ReferralQrCode({ className }: { className?: string }) {
  const myReferralLink = useReferral();
  return (
    <div
      className={clsx(
        className,
        'flex items-center justify-between gap-8 text-xxs',
      )}
    >
      <div>
        <p className="mb-3 w-max bg-brand-gradient bg-clip-text font-semibold text-lg text-transparent">
          Ready To Dive In?
        </p>
        <p>Scan the QR Code or Use the Link to Join the GoatX Adventure!</p>
        <img alt="" className="my-3" src={line} />
        <img alt="" className="h-8" src={logo} />
      </div>
      <div className="shrink-0">
        <QRCodeSVG
          bgColor="transparent"
          fgColor="white"
          value={myReferralLink}
          width={100}
        />
      </div>
    </div>
  );
}
