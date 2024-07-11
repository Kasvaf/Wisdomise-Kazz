import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { zeroAddress } from 'viem';
import Button from 'shared/Button';
import { type AirdropEligibilityStatus, useAirdropQuery } from 'api/airdrop';
import { useAirdrop } from 'modules/account/PageToken/web3/airdrop/useAirdrop';
import { ReactComponent as AirdropIcon } from '../icons/airdrop.svg';
import { ReactComponent as XIcon } from './x.svg';

export default function EligibleCheckModalContent({
  eligibility,
  onResolve,
}: {
  eligibility?: AirdropEligibilityStatus;
  onResolve: VoidFunction;
}) {
  const { address } = useAccount();
  const { t } = useTranslation('wisdomise-token');
  const { data: airdrop, refetch: fetchAirdropDetails } = useAirdropQuery(
    address ?? zeroAddress,
  );
  const { isLoading, isClaimed, claim, claimReceipt, refetch } =
    useAirdrop(airdrop);

  useEffect(() => {
    if (claimReceipt?.status === 'success') {
      void refetch();
    }
  }, [claimReceipt, onResolve, refetch]);

  useEffect(() => {
    if (eligibility?.exists) {
      void fetchAirdropDetails();
    }
  }, [eligibility, fetchAirdropDetails]);

  const share = () => {
    const text = `Feeling over-excited! 😍%0A
    I just claimed ${(
      (airdrop?.amount ?? 0) /
      10 ** 6
    ).toLocaleString()} $WSDM of @Wisdomise 1st season airdrop! 🎉
    2nd Phase is coming!  Don't miss the chance to win big! 🧠%0A`;
    const url = 'wisdomise.com/airdrop';
    const hashtags = 'Wisdomise,WSDM,airdrop';
    window.open(
      `https://x.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`,
      '_blank',
    );
  };

  return (
    <div className="flex min-h-[16rem] flex-col items-center gap-4 text-center">
      {eligibility?.exists ? (
        <>
          <AirdropIcon />
          {isClaimed === undefined ? null : isClaimed ? (
            <div>
              <p className="my-5">
                Congratulations on your airdrop! Did you know you can stake and
                earn up to 32% APY? Don’t let this opportunity pass!
              </p>
              <Button
                variant="primary-purple"
                className="mt-3 w-64"
                onClick={() =>
                  window.open('https://staking.wisdomise.com', '_blank')
                }
              >
                Stake $WSDM
              </Button>
            </div>
          ) : (
            <div>
              <div>
                <Trans
                  i18nKey="airdrop.eligibility.eligible"
                  ns="wisdomise-token"
                >
                  You are <span className="text-green-400">eligible</span> to
                  claim
                </Trans>
              </div>
              <div className="mt-3 text-3xl italic">
                <strong>
                  {((airdrop?.amount ?? 0) / 10 ** 6).toLocaleString()}
                </strong>{' '}
                <strong>WSDM</strong>
              </div>
              <Button
                className="mt-6 w-64 max-md:w-full"
                variant="primary-purple"
                disabled={isLoading}
                loading={isLoading}
                onClick={claim}
              >
                {t('airdrop.eligibility.claim')}
              </Button>
            </div>
          )}
          <Button
            className="w-64 max-md:w-full"
            variant="alternative"
            onClick={share}
          >
            <div className="flex items-center gap-2">
              <XIcon />
              {t('airdrop.eligibility.share')}
            </div>
          </Button>
        </>
      ) : (
        <>
          <AirdropIcon className="hue-rotate-[200deg]" />
          <p className="mb-4">
            <Trans
              i18nKey="airdrop.eligibility.not-eligible"
              ns="wisdomise-token"
            >
              You are <span className="text-red-400">not eligible</span> for
              this round of WSDM Airdrop
            </Trans>
          </p>
        </>
      )}
    </div>
  );
}
