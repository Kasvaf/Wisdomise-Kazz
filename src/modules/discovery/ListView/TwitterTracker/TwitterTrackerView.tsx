import { type FC } from 'react';
import { useStreamTweets, useTwitterFollowedAccounts } from 'api/discovery';

export const TwitterTrackerView: FC = () => {
  const followings = useTwitterFollowedAccounts();
  const tweets = useStreamTweets({
    userIds: followings.value
      .filter(x => !x.hide_from_list)
      .map(x => x.user_id),
  });
  return (
    <div className="flex flex-col gap-4">
      {tweets.data.map(tweet => (
        <div key={tweet.tweet_id} className="whitespace-pre font-mono text-xxs">
          {JSON.stringify(tweet, null, 2)}
        </div>
      ))}
    </div>
  );
};
