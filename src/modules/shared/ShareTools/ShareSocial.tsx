import { bxCopy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import Icon from 'shared/Icon';
import { useShare } from 'shared/useShare';
import { useSocialShare } from 'shared/useSocialShare';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as XIcon } from 'shared/v1-components/X/assets/x.svg';
import { ReactComponent as LinkedinIcon } from './images/linkedin.svg';
import { ReactComponent as TelegramIcon } from './images/telegram.svg';

export default function ShareSocial({
  text,
  link,
  className,
}: {
  text: string;
  link: string;
  className?: string;
}) {
  const { shareOnTwitter, shareOnTelegram, shareOnLinkedin } = useSocialShare();
  const [copy, content] = useShare('copy');

  return (
    <div
      className={clsx('flex gap-2 [&>*]:bg-transparent [&>*]:px-2', className)}
    >
      <Button
        onClick={() => shareOnTelegram(text, link)}
        size="sm"
        variant="outline"
      >
        <TelegramIcon />
      </Button>
      <Button
        onClick={() => shareOnTwitter(text, link, ['GoatX'])}
        size="sm"
        variant="outline"
      >
        <XIcon />
      </Button>
      <Button
        onClick={() => shareOnLinkedin(`${text}\n ${link}`)}
        size="sm"
        variant="outline"
      >
        <LinkedinIcon />
      </Button>
      <Button
        onClick={() => copy(`${text}\n ${link}`)}
        size="sm"
        variant="outline"
      >
        <Icon name={bxCopy} />
      </Button>
      {content}
    </div>
  );
}
