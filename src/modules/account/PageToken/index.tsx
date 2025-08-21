import Balance from 'modules/account/PageToken/Balance/Balance';
import ImportTokenButton from 'modules/account/PageToken/ImportTokenButton';
import Migration from 'modules/account/PageToken/Migration';
import Vesting from 'modules/account/PageToken/Vesting';
import Wallet from 'modules/account/PageToken/Wallet';
import PageWrapper from 'modules/base/PageWrapper';
import { Trans, useTranslation } from 'react-i18next';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useIsMobile from 'utils/useIsMobile';
import { useAccount } from 'wagmi';
import ConnectWalletGuard from '../PageBilling/paymentMethods/Token/ConnectWalletGuard';

export default function PageToken() {
  const { t } = useTranslation('wisdomise-token');
  const isMobile = useIsMobile();
  const { isConnected } = useAccount();

  return (
    <PageWrapper
      extension={!isMobile && <CoinExtensionsGroup />}
      hasBack
      title={null}
    >
      <div className="my-10 flex flex-wrap items-center justify-between gap-4 md:gap-6">
        <h1 className="text-center">
          <Trans i18nKey="wisdomise-token:title" ns="wisdomise-token">
            <strong className="font-semibold text-5xl text-white/20">
              Wisdomise Token
            </strong>
            <span className="ms-2 font-thin text-3xl text-white/60">WSDM</span>
          </Trans>
        </h1>
        {isConnected && (
          <ImportTokenButton className="max-md:w-full" tokenSymbol="WSDM" />
        )}
      </div>
      <ConnectWalletGuard
        description={t(
          'wisdomise-token:connect-wallet.wisdomise-token.description',
        )}
        title={t('wisdomise-token:connect-wallet.wisdomise-token.title')}
      >
        <Migration />
        <Vesting />
        {/* <Airdrop /> */}
        {/* <h1 className="my-8 flex flex-wrap items-center justify-between gap-4 text-xl text-white/20"> */}
        {/*   <div className="flex items-center gap-2"> */}
        {/*     <Trans i18nKey="wisdomise-token:utility.title" ns="wisdomise-token"> */}
        {/*       <strong className="text-3xl font-bold">WSDM</strong> */}
        {/*       <span className="ms-2 text-lg">Utility</span> */}
        {/*     </Trans> */}
        {/*   </div> */}
        {/*   <ImportTokenButton */}
        {/*     tokenSymbol="lcWSDM" */}
        {/*     variant="primary-purple" */}
        {/*     className="max-md:w-full" */}
        {/*   /> */}
        {/* </h1> */}
        {/* <Utility /> */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Wallet />
          <Balance />
        </div>
      </ConnectWalletGuard>
    </PageWrapper>
  );
}
