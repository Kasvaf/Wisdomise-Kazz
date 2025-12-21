import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { calcValueByThreshold } from 'modules/discovery/ListView/NetworkRadar/lib';
import {
  type TwitterUser,
  useTwitterCommunityPreviewQuery,
} from 'services/rest/twitter';
import { HoverTooltip } from 'shared/HoverTooltip';
import { ReadableDate } from 'shared/ReadableDate';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Button } from 'shared/v1-components/Button';
import Skeleton from 'shared/v1-components/Skeleton';
import { ReactComponent as CalendarIcon } from 'shared/v1-components/X/assets/calendar.svg';
import { ReactComponent as XIcon } from 'shared/v1-components/X/assets/x.svg';
import { XUser, XUserSkeleton } from 'shared/v1-components/X/XProfileEmbed';

export default function XCommunityEmbed({
  communityId,
}: {
  communityId: string;
}) {
  const { data, isPending } = useTwitterCommunityPreviewQuery({ communityId });

  const creator = data?.community_info?.creator;
  const communityUrl = `https://x.com/i/communities/${communityId}`;

  const calcTimeColor = () =>
    calcValueByThreshold({
      value:
        Date.now() -
        (data?.community_info?.created_at
          ? new Date(data?.community_info?.created_at).getTime()
          : 0),
      rules: [
        { limit: 10 * 60 * 1000, result: 'text-v1-content-positive' },
        { limit: 60 * 60 * 1000, result: 'text-v1-content-notice' },
      ],
      fallback: 'text-v1-content-negative',
    });

  return (
    <div
      className="flex min-h-72 w-72 flex-col items-center justify-center overflow-hidden rounded-lg border border-x-border bg-x-bg text-sm hover:bg-x-bg-hover"
      onClick={e => e.stopPropagation()}
    >
      {isPending ? (
        <div className="w-full">
          <Skeleton className="!rounded-none aspect-3/1 w-full bg-white/5" />
          <div className="space-y-2 p-3">
            <Skeleton className="w-32 bg-white/5" />
            <Skeleton className="mt-8 h-8 rounded-xl bg-white/5" />
            <div className="flex items-center gap-1">
              <Skeleton className="!rounded-full size-8 shrink-0 bg-white/5" />
              <Skeleton className="bg-white/5 leading-none" />
            </div>
            <hr className="my-3 border-x-border" />
            <Skeleton className="mb-4 w-24 bg-white/5" />
            <XUserSkeleton />
            <Skeleton className="h-10 rounded-xl bg-white/5" />
          </div>
        </div>
      ) : data?.community_info && creator ? (
        <>
          <img
            alt=""
            className="aspect-3/1 w-full bg-white/5"
            src={data.community_info.banner_url}
          />
          <div className="flex w-full grow flex-col p-4 pt-3">
            <div className="flex items-start justify-between gap-2">
              <a
                className="hover:!underline break-words text-left font-medium text-base"
                href={communityUrl}
                target="_blank"
              >
                {data.community_info.name}
              </a>
              <a
                className="flex flex-col items-end gap-1"
                href={communityUrl}
                target="_blank"
              >
                <HoverTooltip title="View Community on X">
                  <XIcon className="size-5" />
                </HoverTooltip>
                <HoverTooltip title="Community Created at">
                  <div>
                    <ReadableDate
                      className={clsx(calcTimeColor(), 'font-medium')}
                      suffix={false}
                      value={data.community_info.created_at}
                    />
                  </div>
                </HoverTooltip>
              </a>
            </div>
            <p className="mt-3 mb-3 break-words">
              {data.community_info.description}
            </p>
            <XCommunityMembers
              count={data.community_info.member_count}
              members={data.community_info.members_preview}
            />
            <hr className="my-3 border-x-border" />
            <p className="mb-2 text-x-content-secondary">Created By</p>
            <XUser
              isBlueVerified={creator.isBlueVerified}
              name={creator.name}
              profilePicture={creator.profile_image_url_https}
              username={creator.screen_name}
            />
            <div className="mt-3 mb-1 flex items-center gap-1 text-x-content-secondary">
              <CalendarIcon className="size-4" />
              Created {dayjs(data.community_info.created_at).format('MMM YYYY')}
            </div>
            <div className="mb-3 flex items-center gap-1">
              <ReadableNumber
                className="font-medium"
                format={{ decimalLength: 1 }}
                value={creator.following_count}
              />
              <span className="text-x-content-secondary">Following</span>
              <ReadableNumber
                className="ml-3 font-medium"
                format={{ decimalLength: 1 }}
                value={creator.followers_count}
              />
              <span className="text-x-content-secondary">Followers</span>
            </div>
            <Button
              as="a"
              className="!bg-transparent !text-x-content-brand !rounded-full w-full"
              href={communityUrl}
              size="md"
              target="_blank"
              variant="outline"
            >
              View Community on <XIcon className="[*>svg]:size-3" />
            </Button>
          </div>
        </>
      ) : (
        'Community Not Found'
      )}
    </div>
  );
}

function XCommunityMembers({
  members,
  count,
}: {
  members: TwitterUser[];
  count: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={
          '-space-x-4 inline-flex w-auto shrink items-center justify-start'
        }
      >
        {members.slice(0, 5).map(member => (
          <img
            alt=""
            className="size-8 rounded-full border-2 border-x-bg-hover bg-white/5"
            key={member.id}
            src={member.profile_image_url_https}
          />
        ))}
      </span>
      <span>
        <ReadableNumber format={{ compactInteger: true }} value={count} />{' '}
        <span className="text-x-content-secondary">Members</span>
      </span>
    </div>
  );
}
