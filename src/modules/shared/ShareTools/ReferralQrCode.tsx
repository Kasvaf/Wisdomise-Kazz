import { QRCodeSVG } from 'qrcode.react';
import { clsx } from 'clsx';
import line from 'shared/ShareTools/images/line.svg';
import logo from 'assets/logo-white.svg';
import { useReferral } from 'modules/account/PageReferral/useReferral';
import ready from './images/ready.png';

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
        {/* used image because of text gradient limit in screenshot */}
        <p className="mb-3 w-max bg-brand-gradient bg-clip-text text-lg font-semibold text-transparent">
          Ready To Dive In?
        </p>
        <p>Scan the QR Code or Use the Link to Join the GoatX Adventure!</p>
        <img src={line} alt="" className="my-3" />
        <img src={logo} className="h-5" alt="" />
      </div>
      <div className="shrink-0">
        <QRCodeSVG
          width={100}
          value={myReferralLink}
          bgColor="transparent"
          fgColor="white"
        />
      </div>
    </div>
  );
}
