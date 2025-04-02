import { QRCodeSVG } from 'qrcode.react';
import line from 'shared/ShareTools/images/line.svg';
import logo from 'shared/ShareTools/images/logo.png';
import { useReferral } from 'modules/account/PageReferral/useReferral';
import ready from './images/ready.png';

export default function ReferralQrCode() {
  const myReferralLink = useReferral();
  return (
    <div className="mt-4 flex items-center justify-between gap-8">
      <div>
        {/* used image because of text gradient limit in screenshot */}
        <img src={ready} alt="ready" className="mb-2 h-4" />
        <p className="max-w-40 text-xxs">
          Scan the QR Code or Use the Link to Join the Wisdomise Adventure!
        </p>
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
