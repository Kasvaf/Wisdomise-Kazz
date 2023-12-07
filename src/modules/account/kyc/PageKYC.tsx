import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSumsubVerified, useVerifiedWallets, useAccountQuery } from 'api';
import CoinsIcons from 'shared/CoinsIcons';
import PageWrapper from 'modules/base/PageWrapper';
import Card from 'modules/shared/Card';
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
  const { t } = useTranslation('kyc');
  const sumsubVerified = useSumsubVerified();
  const account = useAccountQuery();
  const wallets = useVerifiedWallets();
  const [ModalVerifyWallet, openVerifyWallet] = useModalVerifyWallet();

  const loading =
    sumsubVerified.isLoading || account.isLoading || wallets.isLoading;
  return (
    <PageWrapper loading={loading}>
      <h1 className="mb-8 text-xl font-semibold">KYC</h1>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <Card className="w-full !p-6">
            <h2 className="font-semibold">
              <span className="text-xl font-bold">1.</span>{' '}
              {t('identification.title')}
            </h2>

            <div className="flex items-start justify-between gap-4">
              <div className="mt-8 text-xs text-white/60">
                {t('identification.description')}
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
                  to="/account/kyc/sumsub"
                  className="rounded-xl bg-white px-5 py-3 text-center text-[14px] text-black"
                >
                  {t('identification.btn-start-sumsub')}
                </NavLink>
              )}
            </div>
          </Card>
          {/* -------------------------------------------------- */}
          <Card className="w-full !p-6">
            <h2 className="font-semibold">
              <span className="text-xl font-bold">2.</span>{' '}
              {t('verification.title')}
            </h2>

            <div className="flex items-start justify-between gap-4">
              <div className="mt-8 text-xs text-white/60">
                {t('verification.description')}
              </div>
              <div>
                <VerificationSvg className="h-[100px] w-[100px] saturate-0" />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center justify-between gap-3 md:flex-row">
              <div className="flex flex-col items-start">
                {
                  badgeByCalendlyStatus[
                    account.data?.wisdomise_verification_status || 'UNKNOWN'
                  ]
                }
                {sumsubVerified.data !== 'VERIFIED' && (
                  <ul className="ml-3 mt-1 list-disc text-[10px] text-[#F1AA40]">
                    <li>{t('verification.identify-first-notice')}</li>
                  </ul>
                )}
              </div>

              {account.data?.wisdomise_verification_status === 'UNVERIFIED' && (
                <a
                  target="_blank"
                  href={
                    sumsubVerified.data === 'VERIFIED'
                      ? 'https://calendly.com/wisdomise-kyc/15-minute-kyc'
                      : undefined
                  }
                  className={clsx(
                    'rounded-xl px-5 py-3 text-center text-[14px]',
                    sumsubVerified.data === 'VERIFIED'
                      ? 'bg-white text-black'
                      : 'cursor-default bg-white/5 text-white/10',
                  )}
                  rel="noreferrer noopener"
                >
                  {t('verification.btn-calendly')}
                </a>
              )}
            </div>
          </Card>
        </div>
        {/* -------------------------------------------------- */}
        <Card className="w-full !p-6">
          <h2 className="mb-8 font-semibold">{t('wallet.title')}</h2>
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs text-white/60">
              {t('wallet.description')}
            </div>
            <div>
              <WalletSvg className="h-[100px] w-[100px] saturate-0" />
            </div>
          </div>

          <div className="mb-3 border-b border-solid border-white/10 pb-3">
            {t('wallet.list-title')}
          </div>
          {wallets.data?.length ? (
            <ol className="flex list-decimal flex-col gap-3 pl-6 text-white/50">
              {wallets.data?.map(w => (
                <li
                  key={String(w.network?.name) + w.address}
                  className="rounded-xl bg-black/20 p-2 lg:px-4"
                >
                  <div className="flex shrink-0 grow-0 flex-wrap items-stretch text-white lg:flex-nowrap lg:gap-2">
                    <div className="basis-1/2 lg:basis-1/4">
                      <div className="mb-4 text-xs text-white/40">
                        {t('wallet.column.name')}
                      </div>
                      {w.name ? (
                        <div className="text-xs">{w.name}</div>
                      ) : (
                        <div className="text-xs text-white/50">
                          {t('wallet.unnamed')}
                        </div>
                      )}
                    </div>

                    <div className="basis-1/2 lg:basis-1/4">
                      <div className="mb-4 text-xs text-white/40">
                        {t('wallet.column.coin')}
                      </div>
                      <div className="mt-[-5px] flex items-center gap-2 text-sm">
                        <div>
                          <CoinsIcons coins={[w.symbol.name]} size="small" />
                        </div>
                        <div className="text-xs">{w.network?.description}</div>
                      </div>
                    </div>

                    <div className="mt-2 w-full basis-full border-t border-white/20 pt-2 lg:m-0 lg:basis-1/2 lg:border-none lg:p-0">
                      <div className="mb-4 text-xs text-white/40">
                        {t('wallet.column.wallet-address')}
                      </div>
                      <div className="line-clamp-1 text-xs">{w.address}</div>
                    </div>

                    <div className="mt-2 flex basis-full items-center justify-stretch lg:mt-0 lg:basis-1/6">
                      <Badge
                        color="green"
                        text="verified"
                        className="w-full text-center"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-xs text-white/50">
              {t('wallet.empty-message')}
            </div>
          )}

          <div className="mt-4 flex justify-center md:justify-end">
            {ModalVerifyWallet}
            <button
              className="rounded-xl bg-white px-5 py-3 text-center text-[14px] text-black"
              onClick={openVerifyWallet}
            >
              {wallets.data?.length ? 'Verify More Wallets' : 'Verify Wallet'}
            </button>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
