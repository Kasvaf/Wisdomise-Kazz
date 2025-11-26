import { bxCalendar } from 'boxicons-quasar';
import dayjs from 'dayjs';
import {
  type TwitterUser,
  useTwitterCommunityPreviewQuery,
} from 'services/rest/twitter';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { shortFromNow } from 'shared/TokenSocials/lib';
import { Button } from 'shared/v1-components/Button';
import { XUser } from 'shared/v1-components/X/XProfileEmbed';
import { ReactComponent as XIcon } from '../x.svg';

export default function XCommunityEmbed({
  communityId,
}: {
  communityId: string;
}) {
  const { data, isPending } = useTwitterCommunityPreviewQuery({ communityId });

  const openCommunity = () => {
    window.open(`https://x.com/i/communities/${communityId}`, '_blank');
  };

  const admin = data?.community_info?.admin;

  return (
    <div
      className="flex min-h-72 w-72 flex-col items-center justify-center rounded-md bg-(--x-bg-color) text-sm"
      onClick={e => e.stopPropagation()}
      style={{ ['--x-bg-color' as never]: '#15202b' }}
    >
      {isPending ? (
        <div className="w-full space-y-3 p-3">
          <div className="h-20 rounded-xl bg-white/5" />
          <div className="h-30 rounded-xl bg-white/5" />
          <div className="h-30 rounded-xl bg-white/5" />
          <div className="h-16 rounded-xl bg-white/5" />
        </div>
      ) : data?.community_info && admin ? (
        <>
          <img
            alt=""
            className="aspect-3/1 w-full bg-white/5"
            src={data.community_info.banner_url}
          />
          <div className="flex w-full grow flex-col p-4 pt-3">
            <div className="relative flex items-center gap-2">
              <button
                className="absolute top-2 right-0 flex flex-col items-center"
                onClick={openCommunity}
              >
                <XIcon className="size-6" />
                <div className="mt-1">
                  {shortFromNow(data.community_info.created_at)}
                </div>
              </button>
              <h1 className="flex items-center gap-1 font-medium text-base">
                <button className="hover:underline" onClick={openCommunity}>
                  {data.community_info.name}
                </button>
              </h1>
            </div>
            <p className="mt-8 mb-3">{data.community_info.description}</p>
            <XCommunityMembers members={data.community_info.members_preview} />
            <hr className="my-3 border-x-border" />
            <p className="mb-2 text-x-content-secondary">Created By</p>
            <XUser
              isBlueVerified={admin.isBlueVerified}
              name={admin.name}
              profilePicture={admin.profile_image_url_https}
              username={admin.screen_name}
            />
            <div className="mt-3 mb-1 flex items-center gap-1 text-x-content-secondary">
              <Icon name={bxCalendar} size={14} />
              Created {dayjs(data.community_info.created_at).format('MMM YYYY')}
            </div>
            <div className="mb-3 flex items-center gap-1">
              <ReadableNumber
                className="font-medium"
                value={admin.following_count}
              />
              <span className="text-x-content-secondary">Following</span>
              <ReadableNumber
                className="ml-2 font-medium"
                value={admin.followers_count}
              />
              <span className="text-x-content-secondary">Followers</span>
            </div>
            <Button
              className="!bg-transparent !text-x-content-brand !rounded-full w-full"
              onClick={openCommunity}
              size="md"
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

function XCommunityMembers({ members }: { members: TwitterUser[] }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={
          '-space-x-4 inline-flex w-auto shrink cursor-help items-center justify-start'
        }
      >
        {members.slice(0, 5).map(member => (
          <img
            alt=""
            className="size-8 rounded-full border-(--x-bg-color) border-2 bg-white/5"
            key={member.id}
            src={member.profile_image_url_https}
          />
        ))}
      </span>
      <span>
        <ReadableNumber
          format={{ compactInteger: true }}
          value={members.length}
        />{' '}
        <span className="text-x-content-secondary">Members</span>
      </span>
    </div>
  );
}
