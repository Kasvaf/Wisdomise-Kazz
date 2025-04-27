import type { RefObject } from 'react';
import { bxCopy, bxDownload, bxLink } from 'boxicons-quasar';
import { useReferral } from 'modules/account/PageReferral/useReferral';
import { useScreenshot } from 'shared/useScreenshot';
import { useSocialShare } from 'shared/useSocialShare';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { Input } from 'shared/v1-components/Input';
import { ReactComponent as TelegramIcon } from './images/telegram.svg';
import { ReactComponent as XIcon } from './images/twitter.svg';
import { ReactComponent as LinkedinIcon } from './images/linkedin.svg';

export function ReferralShareLinks({
  screenshotTarget,
  fileName,
}: {
  screenshotTarget: RefObject<HTMLElement>;
  fileName: string;
}) {
  const myReferralLink = useReferral();
  const { capture, isCapturing } = useScreenshot(screenshotTarget, {
    fileName,
    afterCapture: 'download',
  });
  const { shareOnTwitter, shareOnTelegram, shareOnLinkedin } = useSocialShare();
  const [copy, content] = useShare('copy');

  const SHARE_TEXT = 'Join Wisdomise Adventure!';

  return (
    <div>
      <p className="text-xs text-v1-content-secondary">
        Download the Image and Share It With Your Referral Link
      </p>
      <Input
        readOnly={true}
        size="md"
        className="my-3 w-full"
        suffixIcon={
          <Icon
            name={bxCopy}
            className="ml-3"
            onClick={() => copy(myReferralLink)}
          />
        }
        value={myReferralLink}
      />
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-2 [&>*]:bg-transparent [&>*]:px-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => shareOnTelegram(SHARE_TEXT, myReferralLink)}
          >
            <TelegramIcon />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              shareOnTwitter(SHARE_TEXT, myReferralLink, [
                'Wisdomise',
                'AutoTrader',
              ])
            }
          >
            <XIcon />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => shareOnLinkedin(myReferralLink)}
          >
            <LinkedinIcon />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copy(myReferralLink)}
          >
            <Icon name={bxLink} />
          </Button>
        </div>
        <Button
          className="ml-auto"
          variant="white"
          size="sm"
          onClick={capture}
          loading={isCapturing}
        >
          <Icon name={bxDownload} />
          Download
        </Button>
      </div>
      {content}
    </div>
  );
}
