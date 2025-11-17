import logo from 'assets/logo-green.svg';
import { clsx } from 'clsx';
import { useReferral } from 'modules/account/PageReferral/useReferral';
import { QRCodeSVG } from 'qrcode.react';

export default function ReferralQrCode({ className }: { className?: string }) {
  const myReferralLink = useReferral();
  return (
    <div
      className={clsx(
        className,
        'flex items-center justify-between gap-8 text-xs',
      )}
    >
      <div>
        <p className="mb-2 font-semibold text-sm text-v1-content-brand">
          Ready To Dive In?
        </p>
        <p>Scan the QR Code or Use the Link to Join the GoatX Adventure!</p>
        <img alt="" className="mt-3 h-6" src={logo} />
      </div>
      <div className="shrink-0">
        <QRCodeSVG
          bgColor="transparent"
          fgColor="white"
          height={80}
          value={myReferralLink}
          width={80}
        />
      </div>
    </div>
  );
}
