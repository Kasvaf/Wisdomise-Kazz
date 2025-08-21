import { bxCopy, bxDownload, bxLink } from 'boxicons-quasar';
import { useReferral } from 'modules/account/PageReferral/useReferral';
import type { RefObject } from 'react';
import Icon from 'shared/Icon';
import { useScreenshot } from 'shared/useScreenshot';
import { useShare } from 'shared/useShare';
import { useSocialShare } from 'shared/useSocialShare';
import { Button } from 'shared/v1-components/Button';
import { Input } from 'shared/v1-components/Input';
import { ReactComponent as LinkedinIcon } from './images/linkedin.svg';
import { ReactComponent as TelegramIcon } from './images/telegram.svg';
import { ReactComponent as XIcon } from './images/twitter.svg';

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
        suffixIcon={
          <Icon
            className="ml-3"
            name={bxCopy}
            onClick={() => copy(myReferralLink)}
          />
        }
        surface={2}
        value={myReferralLink}
      />
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-2 [&>*]:bg-transparent [&>*]:px-2">
          <Button
            onClick={() => shareOnTelegram(SHARE_TEXT, myReferralLink)}
            size="sm"
            variant="outline"
          >
            <TelegramIcon />
          </Button>
          <Button
            onClick={() =>
              shareOnTwitter(SHARE_TEXT, myReferralLink, ['GoatX'])
            }
            size="sm"
            variant="outline"
          >
            <XIcon />
          </Button>
          <Button
            onClick={() => shareOnLinkedin(myReferralLink)}
            size="sm"
            variant="outline"
          >
            <LinkedinIcon />
          </Button>
          <Button
            onClick={() => copy(myReferralLink)}
            size="sm"
            variant="outline"
          >
            <Icon name={bxLink} />
          </Button>
        </div>
        <Button
          className="ml-auto"
          loading={isCapturing}
          onClick={capture}
          size="sm"
          variant="white"
        >
          <Icon name={bxDownload} />
          Download
        </Button>
      </div>
      {content}
    </div>
  );
}
