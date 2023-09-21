import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { useUserInfoQuery, useSumsubVerified, useVerifiedWallets } from 'api';
import CoinsIcons from 'shared/CoinsIcons';
import PageWrapper from 'modules/base/PageWrapper';
import Badge from './Badge';
import { ReactComponent as VerificationSvg } from './verification.svg';
import { ReactComponent as IdentificationSvg } from './identification.svg';
import { ReactComponent as WalletSvg } from './wallet.svg';
import useModalVerifyWallet from './useModalVerifyWallet';

const badgeByCalendlyStatus = {
  UNVERIFIED: <Badge text="Unverified" color="white" />,
  SET_CALENDLY_MEETING: <Badge text="Pending Meeting" color="blue" />,
  VERIFIED: <Badge text="Verified" color="green" />,
  UNKNOWN: <Badge text="loading" color="white" />,
};

const badgeBySumsubStatus = {
  UNVERIFIED: <Badge text="Unverified" color="white" />,
  PENDING: <Badge text="Pending" color="blue" />,
  VERIFIED: <Badge text="Verified" color="green" />,
  REJECTED: <Badge text="Rejected" color="red" />,
};

export default function PageKYC() {
  const sumsubVerified = useSumsubVerified();
  const userInfo = useUserInfoQuery();
  const wallets = useVerifiedWallets();
  const [ModalVerifyWallet, openVerifyWallet] = useModalVerifyWallet();

  const loading =
    sumsubVerified.isLoading || userInfo.isLoading || wallets.isLoading;
  return (
    <PageWrapper loading={loading}>
      <h1 className="mb-8 text-xl font-semibold">Verification</h1>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="w-full rounded-3xl bg-white/5 p-6">
            <h2 className="font-semibold">
              <span className="text-xl font-bold">1.</span> Identification
            </h2>

            <div className="flex items-start justify-between gap-4">
              <div className="mt-8 text-xs text-white/60">
                Identify yourself to help us secure your account.
              </div>
              <div>
                <IdentificationSvg className="h-[100px] w-[100px] saturate-0" />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center justify-between gap-3 md:flex-row">
              <div className="flex flex-col items-start">
                {badgeBySumsubStatus[sumsubVerified.data || 'UNVERIFIED']}
              </div>
              {sumsubVerified.data !== 'VERIFIED' && (
                <NavLink
                  to="/kyc/sumsub"
                  className="rounded-full bg-white px-5 py-3 text-center text-[14px] text-black"
                >
                  Let’s Start in Sumsub
                </NavLink>
              )}
            </div>
          </div>
          {/* -------------------------------------------------- */}
          <div className="w-full rounded-3xl bg-white/5 p-6">
            <h2 className="font-semibold">
              <span className="text-xl font-bold">2.</span> Verification
            </h2>

            <div className="flex items-start justify-between gap-4">
              <div className="mt-8 text-xs text-white/60">
                To verify your account, kindly schedule a meeting on Calendly,
                and we will reach out to assist you with the verification
                process.
              </div>
              <div>
                <VerificationSvg className="h-[100px] w-[100px] saturate-0" />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center justify-between gap-3 md:flex-row">
              <div className="flex flex-col items-start">
                {
                  badgeByCalendlyStatus[
                    userInfo.data?.account.wisdomise_verification_status ||
                      'UNKNOWN'
                  ]
                }
                {sumsubVerified.data !== 'VERIFIED' && (
                  <ul className="ml-3 mt-1 list-disc text-[10px] text-[#F1AA40]">
                    <li>Complete Identification first</li>
                  </ul>
                )}
              </div>

              {userInfo.data?.account.wisdomise_verification_status ===
                'UNVERIFIED' && (
                <a
                  target="_blank"
                  href={
                    sumsubVerified.data === 'VERIFIED'
                      ? 'https://calendly.com/wisdomise-kyc/15-minute-kyc'
                      : undefined
                  }
                  className={clsx(
                    'rounded-full px-5 py-3 text-center text-[14px]',
                    sumsubVerified.data === 'VERIFIED'
                      ? 'bg-white text-black'
                      : 'cursor-default bg-white/5 text-white/10',
                  )}
                  rel="noreferrer"
                >
                  Schedule in Calendly
                </a>
              )}
            </div>
          </div>
        </div>
        {/* -------------------------------------------------- */}
        <div className="w-full rounded-3xl bg-white/5 p-6">
          <h2 className="mb-8 font-semibold">Wallet Verification</h2>
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs text-white/60">
              Verify your wallets to activate and unlock all of our products and
              features.
            </div>
            <div>
              <WalletSvg className="h-[100px] w-[100px] saturate-0" />
            </div>
          </div>

          <div className="mb-3 border-b border-solid border-white/10 pb-3">
            Wallet Status
          </div>
          {wallets.data?.length ? (
            <ol className="flex list-decimal flex-col gap-3 pl-6 text-white/50">
              {wallets.data?.map(w => (
                <li
                  key={String(w.network?.name) + w.address}
                  className="rounded-3xl bg-black/20 p-2 md:px-4"
                >
                  <div className="flex shrink-0 grow-0 flex-wrap items-stretch text-white">
                    <div className="basis-1/2 md:basis-1/4">
                      <div className="mb-4 text-xs text-white/40">
                        Wallet name
                      </div>
                      {w.name ? (
                        <div className="text-xs">{w.name}</div>
                      ) : (
                        <div className="text-xs text-white/50">(unnamed)</div>
                      )}
                    </div>

                    <div className="basis-1/2 md:basis-1/4">
                      <div className="mb-4 text-xs text-white/40">Coin</div>
                      <div className="mt-[-5px] flex items-center gap-2 text-sm">
                        <div>
                          <CoinsIcons coins={[w.symbol.name]} size="small" />
                        </div>
                        <div className="text-xs">{w.network?.description}</div>
                      </div>
                    </div>

                    <div className="mt-2 basis-full border-t border-white/20 pt-2 md:m-0 md:basis-1/2 md:border-none md:p-0">
                      <div className="mb-4 text-xs text-white/40">
                        Wallet Address
                      </div>
                      <div className="text-xs">{w.address}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-xs text-white/50">
              You have no verified wallet address.
            </div>
          )}

          <div className="mt-4 flex justify-center md:justify-end">
            {ModalVerifyWallet}
            <button
              className="rounded-full bg-white px-5 py-3 text-center text-[14px] text-black"
              onClick={openVerifyWallet}
            >
              Verify Wallet
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
