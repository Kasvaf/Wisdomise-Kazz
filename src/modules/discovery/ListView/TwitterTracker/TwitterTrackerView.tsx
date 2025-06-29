import { useState, type FC } from 'react';
import { bxPlus } from 'boxicons-quasar';
import {
  type TwitterTweet,
  useStreamTweets,
  useTwitterFollowedAccounts,
} from 'api/discovery';
import { Dialog } from 'shared/v1-components/Dialog';
import useIsMobile from 'utils/useIsMobile';
import Spinner from 'shared/Spinner';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { TweetCard } from './TweetCard';

export const TwitterTrackerView: FC<{ onRequestEdit?: () => void }> = ({
  onRequestEdit,
}) => {
  const [openedMedia, setOpenedMedia] = useState<
    TwitterTweet['media'][number] | null
  >(null);
  const [mediaModal, setMediaModal] = useState(false);
  const isMobile = useIsMobile();
  const followings = useTwitterFollowedAccounts();
  const tweets = useStreamTweets({
    userIds: followings.value
      .filter(x => !x.hide_from_list)
      .map(x => x.user_id),
  });
  return (
    <div className="divide-y divide-v1-content-primary/10">
      {tweets.isLoading || followings.isLoading || tweets.isPending ? (
        <Spinner className="mx-auto my-6" />
      ) : (tweets.data?.length ?? 0) === 0 ? (
        <>
          <div className="flex flex-col items-center py-10">
            <h3 className="mb-2 text-xs font-semibold">{'Nothing to Show!'}</h3>
            <p className="mb-4 max-w-[220px] text-center text-xs text-v1-content-secondary">
              {followings.value.length === 0 && followings.rawValue
                ? 'Follow accounts to see their tweets here'
                : 'None of your followed accounts have posted tweets in the last 24 hours'}
            </p>
            <Button
              size="xs"
              onClick={onRequestEdit}
              surface={2}
              variant="outline"
            >
              <Icon name={bxPlus} />
              {'Add More Channels'}
            </Button>
          </div>
        </>
      ) : (
        <>
          <Dialog
            mode={isMobile ? 'drawer' : 'modal'}
            modalConfig={{ closeButton: true }}
            drawerConfig={{ closeButton: true, position: 'bottom' }}
            open={!!openedMedia && mediaModal}
            onClose={() => setMediaModal(false)}
            contentClassName="mobile:p-3"
          >
            <img
              src={openedMedia?.url}
              className="h-auto min-h-16 w-full rounded-lg bg-v1-surface-l2 object-contain"
              alt={openedMedia?.url}
            />
          </Dialog>
          {tweets.data.map(tweet => (
            <div
              key={tweet.tweet_id}
              className="whitespace-pre py-3 font-mono text-xxs"
            >
              <TweetCard
                value={tweet}
                className="bg-v1-surface-l1"
                onOpenMedia={media => {
                  setOpenedMedia(media);
                  setMediaModal(true);
                }}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};
