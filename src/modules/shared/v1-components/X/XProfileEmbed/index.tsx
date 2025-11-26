import { bxCalendar } from 'boxicons-quasar';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { useTwitterUserPreviewQuery } from 'services/rest/twitter';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as XIcon } from '../x.svg';
import { ReactComponent as VerifiedIcon } from './verified.svg';

export default function XProfileEmbed({ username }: { username: string }) {
  const { data, isPending } = useTwitterUserPreviewQuery({ username });

  const openProfile = () => {
    window.open(`https://x.com/${username}`, '_blank');
  };

  return (
    <div
      className="flex min-h-72 w-72 flex-col items-center justify-center rounded-md bg-x-bg text-sm"
      onClick={e => e.stopPropagation()}
    >
      {isPending ? (
        'Loading...'
      ) : data && !data.unavailable ? (
        <>
          <div className="aspect-3/1 w-full bg-white/5">
            {data.coverPicture && (
              <img alt="" className="h-full w-full" src={data.coverPicture} />
            )}
          </div>
          <div className="flex w-full grow flex-col p-4 pt-3">
            <div className="relative">
              <button className="absolute top-2 right-0" onClick={openProfile}>
                <XIcon className="size-6" />
              </button>
              <XUser
                isBlueVerified={data.isBlueVerified}
                name={data.name}
                profilePicture={data.profilePicture}
                username={data.userName}
              />
            </div>
            <p className="mt-3 mb-5 text-x-content-secondary">
              {data.description}
            </p>
            <div className="mt-auto mb-1 flex items-center gap-1 text-x-content-secondary">
              <Icon name={bxCalendar} size={14} />
              Joined {dayjs(data.createdAt).format('MMM YYYY')}
            </div>
            <div className="mb-3 flex items-center gap-1">
              <ReadableNumber
                className="font-medium"
                format={{ decimalLength: 1 }}
                value={data.following}
              />
              <span className="text-x-content-secondary">Following</span>
              <ReadableNumber
                className="ml-auto font-medium"
                format={{ decimalLength: 1 }}
                value={data.followers}
              />
              <span className="text-x-content-secondary">Followers</span>
            </div>
            <Button
              className="!bg-transparent !text-x-content-brand !rounded-3xl w-full"
              onClick={openProfile}
              size="md"
              variant="outline"
            >
              View Profile on <XIcon className="[*>svg]:size-3" />
            </Button>
          </div>
        </>
      ) : (
        'Profile Not Found'
      )}
    </div>
  );
}

export function XUser({
  username,
  name,
  isBlueVerified,
  profilePicture,
  mini,
  className,
}: {
  username: string;
  name: string;
  isBlueVerified?: boolean;
  profilePicture?: string;
  mini?: boolean;
  className?: string;
}) {
  const href = `https://x.com/${username}`;
  const avatar = `https://unavatar.io/x/${username}`;

  return (
    <div className={clsx(className, 'flex items-center gap-2')}>
      <img
        alt=""
        className={clsx('rounded-full bg-white/5', mini ? 'size-6' : 'size-10')}
        src={profilePicture ?? avatar}
      />
      <div
        className={clsx(
          'flex justify-center',
          mini ? 'flex-row gap-1' : 'flex-col gap-1',
        )}
      >
        <p
          className={clsx(
            'flex items-center gap-1 font-medium',
            mini ? 'text-xs' : 'text-sm',
          )}
        >
          <a
            className="hover:!underline leading-none"
            href={href}
            target="_blank"
          >
            {name}
          </a>
          {isBlueVerified && <VerifiedIcon className="size-4" />}
        </p>
        <a
          className="!text-x-content-secondary hover:!underline text-xs"
          href={href}
          target="_blank"
        >
          @{username}
        </a>
      </div>
    </div>
  );
}
