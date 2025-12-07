import { useWhaleDetails } from 'api/discovery';
import { Wallet } from 'shared/v1-components/Wallet';

export const WhaleTitleWidget = ({
  holderAddress,
  networkName,
  hr,
}: {
  className?: string;
  holderAddress: string;
  networkName: string;
  hr?: boolean;
}) => {
  const whale = useWhaleDetails({
    holderAddress,
    networkName,
  });

  const hasScanner =
    whale.data?.scanner_link?.name && whale.data?.scanner_link?.url;

  return (
    <>
      <div>
        <Wallet
          address={holderAddress}
          className="col-span-2 max-md:col-span-6"
        />
        <div className="flex gap-1 ps-10 text-xs">
          <p className="text-v1-content-secondary">{`${networkName} Chain${
            hasScanner ? ': ' : ''
          }`}</p>
          {hasScanner && (
            <a
              className="text-v1-content-link underline hover:text-v1-content-link-hover"
              href={whale?.data?.scanner_link?.url}
              referrerPolicy="no-referrer"
              rel="noreferrer"
              target="_blank"
            >{`${whale?.data?.scanner_link?.name ?? ''} Link`}</a>
          )}
        </div>
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
};
