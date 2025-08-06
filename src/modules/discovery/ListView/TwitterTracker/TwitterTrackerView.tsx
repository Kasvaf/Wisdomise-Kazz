import { useState, type FC } from 'react';
import { bxPlus } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  type TwitterTweet,
  useStreamTweets,
  useTweetRelatedTokens,
  useTwitterFollowedAccounts,
} from 'api/discovery';
import { Dialog } from 'shared/v1-components/Dialog';
import useIsMobile from 'utils/useIsMobile';
import Spinner from 'shared/Spinner';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { Coin } from 'shared/Coin';
import { TweetCard } from './TweetCard';

export const TwitterTrackerView: FC<{
  onRequestEdit?: () => void;
  className?: string;
  expanded?: boolean;
}> = ({ onRequestEdit, className, expanded }) => {
  const { t } = useTranslation();
  const [openedMedia, setOpenedMedia] = useState<
    TwitterTweet['media'][number] | null
  >(null);
  const [openedRelatedTokens, setOpenedRelatedTokens] = useState<
    TwitterTweet['tweet_id'] | null
  >(null);

  const [relatedTokensModal, setRelatedTokensModal] = useState(false);
  const [mediaModal, setMediaModal] = useState(false);
  const relatedTokens = useTweetRelatedTokens(openedRelatedTokens ?? undefined);

  const isMobile = useIsMobile();
  const followings = useTwitterFollowedAccounts();
  const tweets = useStreamTweets({
    userIds: followings.value
      .filter(x => !x.hide_from_list)
      .map(x => x.user_id),
  });
  return (
    <div
      className={clsx(
        'mx-auto h-full divide-y divide-v1-content-primary/10 bg-v1-surface-l0',
        className,
      )}
    >
      {tweets.isLoading || followings.isFetching ? (
        <Spinner className="mx-auto my-6" />
      ) : (tweets.data?.length ?? 0) === 0 ? (
        <>
          <div className="flex flex-col items-center py-10">
            <h3 className="mb-2 text-xs font-semibold">{'Nothing to Show!'}</h3>
            <p className="mb-4 max-w-[220px] text-center text-xs text-v1-content-secondary">
              {followings.value.length === 0 && !followings.isLoading
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
            contentClassName="mobile:p-3 w-p"
          >
            <img
              src={openedMedia?.url}
              className="h-auto min-h-16 w-full rounded-lg bg-v1-surface-l2 object-contain"
              alt={openedMedia?.url}
            />
          </Dialog>
          <Dialog
            mode={isMobile ? 'drawer' : 'popup'}
            modalConfig={{ closeButton: true }}
            drawerConfig={{ closeButton: true, position: 'bottom' }}
            open={!!openedRelatedTokens && relatedTokensModal}
            onClose={() => setRelatedTokensModal(false)}
            contentClassName="mobile:p-3 p-2 mobile:w-auto w-44"
          >
            <h3 className="hidden mobile:block">Related Tokens:</h3>
            {relatedTokens.isLoading ? (
              <p className="animate-pulse p-2 text-center text-xs text-v1-content-secondary">
                {t('common:almost-there')}
              </p>
            ) : (relatedTokens.data?.length ?? 0) === 0 ? (
              <p className="max-w-full p-2 text-start text-xs text-v1-content-secondary">
                {t('common:nothing-to-show')}
              </p>
            ) : (
              <div className="space-y-2">
                {relatedTokens.data?.map(token => (
                  <div
                    key={token.slug}
                    onClick={() => setRelatedTokensModal(false)}
                  >
                    <Coin
                      coin={{
                        slug: token.slug,
                        abbreviation: token.abbreviation,
                        name: token.name,
                        logo_url: token.icon,
                      }}
                      className="w-full text-xs"
                    />
                  </div>
                ))}
              </div>
            )}
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
                onOpenRelatedTokens={tweetOId => {
                  setOpenedRelatedTokens(tweetOId);
                  setRelatedTokensModal(true);
                }}
                expanded={expanded}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};
