import {
  type TwitterTweet,
  useStreamTweets,
  useTweetRelatedTokens,
  useTwitterFollowedAccounts,
} from 'api/discovery';
import { bxPlus } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Coin } from 'shared/Coin';
import Icon from 'shared/Icon';
import Spinner from 'shared/Spinner';
import { Button } from 'shared/v1-components/Button';
import { Dialog } from 'shared/v1-components/Dialog';
import useIsMobile from 'utils/useIsMobile';
import { TweetCard } from './TweetCard';

export const XTrackerView: FC<{
  onRequestEdit?: () => void;
  className?: string;
  expanded?: boolean;
}> = ({ onRequestEdit, className, expanded }) => {
  const { t } = useTranslation();
  const [openedRelatedTokens, setOpenedRelatedTokens] = useState<
    TwitterTweet['tweet_id'] | null
  >(null);

  const [relatedTokensModal, setRelatedTokensModal] = useState(false);
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
        'h-full divide-y divide-v1-content-primary/10 bg-v1-surface-l0',
        className,
      )}
    >
      {tweets.isLoading || followings.isFetching ? (
        <Spinner className="mx-auto my-6" />
      ) : (tweets.data?.length ?? 0) === 0 ? (
        <div className="flex flex-col items-center py-10">
          <h3 className="mb-2 font-semibold text-xs">{'Nothing to Show!'}</h3>
          <p className="mb-4 max-w-[220px] text-center text-v1-content-secondary text-xs">
            {followings.value.length === 0 && !followings.isLoading
              ? 'Follow accounts to see their tweets here'
              : 'None of your followed accounts have posted tweets in the last 24 hours'}
          </p>
          <Button
            className="!hidden"
            onClick={onRequestEdit}
            size="xs"
            surface={2}
            variant="outline"
          >
            <Icon name={bxPlus} />
            {'Add More Channels'}
          </Button>
        </div>
      ) : (
        <>
          <Dialog
            contentClassName="mobile:p-3 p-2 mobile:w-auto w-44"
            drawerConfig={{ closeButton: true, position: 'bottom' }}
            modalConfig={{ closeButton: true }}
            mode={isMobile ? 'drawer' : 'popup'}
            onClose={() => setRelatedTokensModal(false)}
            open={!!openedRelatedTokens && relatedTokensModal}
          >
            <h3 className="mobile:block hidden">Related Tokens:</h3>
            {relatedTokens.isLoading ? (
              <p className="animate-pulse p-2 text-center text-v1-content-secondary text-xs">
                {t('common:almost-there')}
              </p>
            ) : (relatedTokens.data?.length ?? 0) === 0 ? (
              <p className="max-w-full p-2 text-start text-v1-content-secondary text-xs">
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
                      className="w-full text-xs"
                      coin={{
                        slug: token.slug,
                        abbreviation: token.abbreviation,
                        name: token.name,
                        logo_url: token.icon,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </Dialog>
          {tweets.data.map(tweet => (
            <div className="whitespace-pre" key={tweet.tweet_id}>
              <TweetCard
                className={expanded ? 'bg-v1-surface-l1' : ''}
                expanded={expanded}
                onOpenRelatedTokens={tweetOId => {
                  setOpenedRelatedTokens(tweetOId);
                  setRelatedTokensModal(true);
                }}
                value={tweet}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};
