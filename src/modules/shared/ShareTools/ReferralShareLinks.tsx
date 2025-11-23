import { bxCopy, bxsDownload } from 'boxicons-quasar';
import { useReferral } from 'modules/account/PageReferral/useReferral';
import type { RefObject } from 'react';
import Icon from 'shared/Icon';
import ShareSocial from 'shared/ShareTools/ShareSocial';
import { useScreenshot } from 'shared/useScreenshot';
import { Button } from 'shared/v1-components/Button';
import { Input } from 'shared/v1-components/Input';

export function ReferralShareLinks({
  screenshotTarget,
  fileName,
}: {
  screenshotTarget: RefObject<HTMLElement>;
  fileName: string;
}) {
  const referralLink = useReferral();
  const { capture: captureAndDownload, isCapturing: l1 } = useScreenshot(
    screenshotTarget,
    {
      fileName,
      afterCapture: 'download',
    },
  );
  const {
    capture: captureAndCopy,
    isCapturing: l2,
    content,
  } = useScreenshot(screenshotTarget, {
    fileName,
    afterCapture: 'copy',
  });
  const SHARE_TEXT = 'Join GoatX Adventure!';

  return (
    <div>
      <p className="text-v1-content-secondary text-xs">
        Download the Image and Share It With Your Referral Link
      </p>
      <Input
        className="my-3 w-full"
        readOnly={true}
        size="md"
        surface={2}
        value={referralLink}
      />
      <div className="flex flex-wrap gap-2">
        <ShareSocial link={referralLink} text={SHARE_TEXT} />
        <Button
          className="ml-auto"
          loading={l1 || l2}
          onClick={captureAndDownload}
          size="sm"
          variant="outline"
        >
          <Icon name={bxsDownload} />
          Download Image
        </Button>
        <Button
          loading={l1 || l2}
          onClick={captureAndCopy}
          size="sm"
          variant="outline"
        >
          <Icon name={bxCopy} />
          Copy Image
        </Button>
      </div>
      {content}
    </div>
  );
}
