import { useReferralStatusQuery } from 'api';
import { clsx } from 'clsx';
import { useReferral } from 'modules/account/PageReferral/useReferral';
import { QRCodeSVG } from 'qrcode.react';

export default function ReferralQrCode({ className }: { className?: string }) {
  const myReferralLink = useReferral();
  const { data } = useReferralStatusQuery();

  return (
    <div
      className={clsx(
        className,
        'flex items-center justify-between gap-8 text-xs',
      )}
    >
      <div>
        <p className="mb-1 font-semibold text-sm text-v1-content-brand">
          Ready To Dive In?
        </p>
        <p className="text-v1-content-primary/70">
          Scan the QR Code or Use the referral code to Join the GoatX Adventure!
        </p>
        <p className="mt-1 font-medium text-xl">
          <span className="font-normal text-sm text-v1-content-secondary">
            Referral Code:
          </span>{' '}
          {data?.referral_code}
        </p>
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
