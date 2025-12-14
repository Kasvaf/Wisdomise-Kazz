import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { useTwitterUserPreviewQuery } from 'services/rest/twitter';
import { HoverTooltip } from 'shared/HoverTooltip';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Button } from 'shared/v1-components/Button';
import Skeleton from 'shared/v1-components/Skeleton';
import { ReactComponent as BusinessVerifiedIcon } from 'shared/v1-components/X/assets/business-verified.svg';
import { ReactComponent as CalendarIcon } from 'shared/v1-components/X/assets/calendar.svg';
import { ReactComponent as LinkIcon } from 'shared/v1-components/X/assets/link.svg';
import { ReactComponent as LocationIcon } from 'shared/v1-components/X/assets/location.svg';
import { ReactComponent as VerifiedIcon } from 'shared/v1-components/X/assets/verified.svg';
import { ReactComponent as XIcon } from 'shared/v1-components/X/assets/x.svg';
import { getXUserUrl } from 'shared/v1-components/X/utils';

export default function XProfileEmbed({ username }: { username: string }) {
  const { data, isPending } = useTwitterUserPreviewQuery({ username });

  const userUrl = getXUserUrl(username);

  return (
    <div
      className="flex min-h-72 w-72 flex-col items-center justify-center overflow-hidden rounded-lg border border-x-border bg-x-bg text-sm hover:bg-x-bg-hover"
      onClick={e => e.stopPropagation()}
    >
      {isPending ? (
        <div className="w-full">
          <Skeleton className="!rounded-none aspect-3/1 w-full bg-white/5" />
          <div className="space-y-2 p-3">
            <XUserSkeleton />
            <Skeleton className="h-16 rounded-xl bg-white/5" />
            <Skeleton className="h-10 rounded-xl bg-white/5" />
          </div>
        </div>
      ) : data && !data.unavailable ? (
        <>
          <div className="aspect-3/1 w-full bg-white/5">
            {data.coverPicture && (
              <img alt="" className="h-full w-full" src={data.coverPicture} />
            )}
          </div>
          <div className="flex w-full grow flex-col p-4 pt-3">
            <div className="relative">
              <a
                className="absolute top-0 right-0"
                href={userUrl}
                target="_blank"
              >
                <HoverTooltip title="View Profile on X">
                  <XIcon className="size-5" />
                </HoverTooltip>
              </a>
              <XUser
                isBlueVerified={data.isBlueVerified}
                name={data.name}
                profilePicture={data.profilePicture}
                username={data.userName}
                verifiedType={data.verifiedType}
              />
            </div>
            <p className="mt-3 mb-5 break-words text-x-content-secondary">
              {data.description}
            </p>
            <div className="mb-2 flex flex-wrap gap-x-3 gap-y-2 text-x-content-secondary">
              {data.entities?.url?.urls?.[0] && (
                <div className="flex gap-1">
                  <LinkIcon className="mt-0.5 size-4 shrink-0" />
                  <a
                    className="!text-x-content-brand hover:!underline break-all"
                    href={data.entities?.url?.urls[0].url}
                    target="_blank"
                  >
                    {data.entities?.url?.urls[0].display_url}
                  </a>
                </div>
              )}
              {data.location && (
                <div className="flex items-center gap-1">
                  <LocationIcon className="size-4" />
                  {data.location}
                </div>
              )}
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-4" />
                Joined {dayjs(data.createdAt).format('MMM YYYY')}
              </div>
            </div>
            <div className="mb-3 flex items-center gap-1">
              <ReadableNumber
                className="font-medium"
                format={{ decimalLength: 1, exactDecimal: true }}
                value={data.following}
              />
              <span className="text-x-content-secondary">Following</span>
              <ReadableNumber
                className="ml-3 font-medium"
                format={{ decimalLength: 1, exactDecimal: true }}
                value={data.followers}
              />
              <span className="text-x-content-secondary">Followers</span>
            </div>
            <Button
              as="a"
              className="!bg-transparent !text-x-content-brand !rounded-3xl w-full"
              href={userUrl}
              size="md"
              target="_blank"
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
  verifiedType,
}: {
  username: string;
  name: string;
  isBlueVerified?: boolean;
  profilePicture?: string;
  mini?: boolean;
  className?: string;
  verifiedType?: 'Business' | 'Government' | null;
}) {
  const userUrl = getXUserUrl(username);
  const followIntent = `https://x.com/intent/follow?screen_name=${username}`;

  return (
    <div
      className={clsx(
        className,
        'flex items-center gap-2 text-sm leading-none',
      )}
    >
      <img
        alt=""
        className={clsx(
          'shrink-0 rounded-full bg-white/5',
          mini ? 'size-5' : 'size-12',
        )}
        src={profilePicture}
      />
      <div
        className={clsx(
          'flex justify-center',
          mini ? 'flex-row gap-1' : 'flex-col gap-1',
        )}
      >
        <p className={clsx('flex items-center gap-1 font-medium')}>
          <a className="hover:!underline" href={userUrl} target="_blank">
            {name}
          </a>
          {(isBlueVerified || verifiedType) &&
            (verifiedType === 'Business' ? (
              <BusinessVerifiedIcon className="size-4" />
            ) : (
              <VerifiedIcon
                className={clsx(
                  'size-4 shrink-0',
                  verifiedType === 'Government'
                    ? 'text-x-content-secondary'
                    : 'text-x-content-brand',
                )}
              />
            ))}
        </p>
        <div className="flex items-center gap-1">
          <a
            className="!text-x-content-secondary hover:!underline font-light"
            href={userUrl}
            target="_blank"
          >
            @{username}
          </a>
          {!mini && (
            <>
              <span>·</span>
              <a
                className="!text-x-content-brand hover:!underline font-medium"
                href={followIntent}
                target="_blank"
              >
                Follow
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function XUserSkeleton() {
  return (
    <div className={clsx('flex items-center gap-2 text-sm leading-none')}>
      <Skeleton className="!rounded-full size-12 shrink-0 bg-white/5" />
      <div className={clsx('flex justify-center', 'flex-col gap-2')}>
        <Skeleton className="w-max bg-white/5" />
        <Skeleton className="w-32 bg-white/5" />
      </div>
    </div>
  );
}
