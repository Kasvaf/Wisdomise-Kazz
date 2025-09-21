import { useTwitterUserPreviewQuery } from 'api/twitter';
import { bxCalendar } from 'boxicons-quasar';
import dayjs from 'dayjs';
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
      className="flex min-h-72 w-72 flex-col items-center justify-center rounded-md bg-(--x-bg-color) text-sm"
      onClick={e => e.stopPropagation()}
      style={{ ['--x-bg-color' as never]: '#15202b' }}
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
              <XProfile
                isBlueVerified={data.isBlueVerified}
                name={data.name}
                profilePicture={data.profilePicture}
                username={data.userName}
              />
            </div>
            <p className="mt-3 mb-5 text-v1-content-secondary">
              {data.description}
            </p>
            <p className="mt-auto mb-1 flex items-center gap-1 text-v1-content-secondary">
              <Icon name={bxCalendar} size={14} />
              Joined {dayjs(data.createdAt).format('MMM YYYY')}
            </p>
            <div className="mb-3 flex items-center gap-1">
              <ReadableNumber className="font-medium" value={data.following} />
              <span className="text-v1-content-secondary">Following</span>
              <ReadableNumber
                className="ml-2 font-medium"
                value={data.followers}
              />
              <span className="text-v1-content-secondary">Followers</span>
            </div>
            <Button
              className="!bg-transparent !text-v1-content-info !rounded-3xl w-full"
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

export function XProfile({
  username,
  name,
  isBlueVerified,
  profilePicture,
}: {
  username: string;
  name: string;
  isBlueVerified: boolean;
  profilePicture: string;
}) {
  const href = `https://x.com/${username}`;

  return (
    <div className="flex items-center gap-2">
      <img
        alt=""
        className="size-10 rounded-full bg-white/5"
        src={profilePicture}
      />
      <div>
        <p className="flex items-center gap-1 font-medium text-base">
          <a className="hover:!underline" href={href} target="_blank">
            {name}
          </a>
          {isBlueVerified && <VerifiedIcon className="size-4" />}
        </p>
        <a
          className="!text-v1-content-secondary hover:!underline text-xs"
          href={href}
          target="_blank"
        >
          @{username}
        </a>
      </div>
    </div>
  );
}
