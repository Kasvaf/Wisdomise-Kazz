import { useWhaleDetails } from 'api';
import { Wallet } from 'modules/insight/PageWhaleDetails/components/Wallet';

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
          wallet={{
            network: networkName,
            address: holderAddress,
          }}
          mode="title"
          className="col-span-2 mobile:col-span-6"
        />
        <div className="flex gap-1 ps-10 text-xs">
          <p className="text-v1-content-secondary">{`${networkName} Chain${
            hasScanner ? ': ' : ''
          }`}</p>
          {hasScanner && (
            <a
              href={whale?.data?.scanner_link?.url}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noreferrer"
              className="text-v1-content-link underline hover:text-v1-content-link-hover"
            >{`${whale?.data?.scanner_link?.name ?? ''} Link`}</a>
          )}
        </div>
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
};
