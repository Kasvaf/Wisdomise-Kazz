import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';

interface TwitterUserResponse {
  status: 'success';
  msg: 'success';
  data: {
    unavailable: true;
    id: string;
    name: string;
    userName: string;
    location: string;
    url: string;
    description: string;
    entities?: {
      description: unknown;
      url?: {
        urls?: [
          {
            display_url: 'invoix-web-production.up.railway.app';
            expanded_url: 'https://invoix-web-production.up.railway.app';
            indices: [0, 23];
            url: 'https://t.co/zQV48quCK1';
          },
        ];
      };
    };
    protected: boolean;
    isVerified: boolean;
    isBlueVerified: boolean;
    verifiedType?: 'Business' | 'Government';
    followers: number;
    following: number;
    favouritesCount: number;
    statusesCount: number;
    mediaCount: number;
    createdAt: string;
    coverPicture: string;
    profilePicture: string;
    canDm: false;
    affiliatesHighlightedLabel: {
      label: {
        badge: {
          url: string;
        };
        description: string;
        url: {
          url: string;
          url_type: string;
        };
        user_label_type: 'BusinessLabel';
        user_label_display_type: 'Badge';
      };
    };
    isAutomated: boolean;
    automatedBy: unknown;
    pinnedTweetIds: string[];
  };
}

export function useTwitterUserPreviewQuery({ username }: { username: string }) {
  return useQuery({
    queryKey: ['twitter-user-preview', username],
    queryFn: async () => {
      const res = await ofetch<TwitterUserResponse>(
        'delphi/twitter-user-preview/',
        {
          query: { username },
        },
      );
      return res.data;
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: true,
  });
}

export function useTwitterPostPreviewQuery({
  tweetId,
  enabled,
}: {
  tweetId?: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ['twitter-post-preview', tweetId],
    queryFn: async () => {
      const res = await ofetch<TweetV2>('delphi/twitter-post-preview/', {
        query: { tweet_id: tweetId },
      });
      return res;
    },
    enabled: enabled && !!tweetId,
  });
}

export interface TwitterCommunityResponse {
  community_info?: {
    id: string;
    name: string;
    description: string;
    question: string;
    member_count: number;
    moderator_count: number;
    created_at: string;
    join_policy: 'Open';
    invites_policy: 'MemberInvitesAllowed';
    is_nsfw: boolean;
    is_pinned: boolean;
    role: 'NonMember';
    primary_topic: {
      id?: unknown;
      name?: unknown;
    };
    banner_url: string;
    search_tags: unknown[];
    rules: {
      id: string;
      name: string;
      description?: unknown;
    }[];
    creator: TwitterUser;
    admin: TwitterUser;
    members_preview: TwitterUser[];
  };
  status: 'success';
  msg: 'success';
}

export interface TwitterUser {
  id: string;
  name: string;
  screen_name: string;
  location: string;
  url: string;
  description: string;
  email?: string;
  protected: boolean;
  verified: boolean;
  followers_count: number;
  following_count: number;
  friends_count: number;
  favourites_count: number;
  statuses_count: number;
  media_tweets_count: number;
  created_at: string;
  profile_banner_url: string;
  profile_image_url_https: string;
  can_dm: boolean;
  isBlueVerified: boolean;
  affiliatesHighlightedLabel?: {
    label?: {
      badge?: {
        url?: 'https://pbs.twimg.com/profile_images/1955359038532653056/OSHY3ewP_bigger.jpg';
      };
      description?: 'X';
      url?: {
        url?: 'https://twitter.com/X';
        url_type?: 'DeepLink';
      };
      user_label_type?: 'BusinessLabel';
      user_label_display_type?: 'Badge';
    };
  };
}

export function useTwitterCommunityPreviewQuery({
  communityId,
}: {
  communityId: string;
}) {
  return useQuery({
    queryKey: ['twitter-community-preview', communityId],
    queryFn: async () => {
      return await ofetch<TwitterCommunityResponse>(
        'delphi/twitter-community-preview/',
        { query: { community_id: communityId } },
      );
    },
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export interface TweetV2 {
  type: 'tweet';
  id: string;
  url: string;
  twitterUrl: string;
  text: string;
  source?: string;
  retweetCount: number;
  replyCount: number;
  likeCount: number;
  quoteCount: number;
  viewCount: number;
  createdAt: string;
  lang: string;
  bookmarkCount: 0;
  isReply: boolean;
  inReplyToId?: string;
  conversationId: string;
  displayTextRange: [number, number];
  inReplyToUserId?: string;
  inReplyToUsername?: string;
  isPinned: boolean;
  author: {
    type: 'user';
    userName: 'fairtrades69';
    url: 'https://x.com/fairtrades69';
    twitterUrl: 'https://twitter.com/fairtrades69';
    id: '1959252929694597120';
    name: 'fair';
    isVerified: false;
    isBlueVerified: true;
    verifiedType: null;
    profilePicture: 'https://pbs.twimg.com/profile_images/1959257903132499968/xTzsqxP2_normal.jpg';
    coverPicture: 'https://pbs.twimg.com/profile_banners/1959252929694597120/1755958263';
    description: 'Onchain magician. 中国量化. NFA. DYOR.';
    location: '';
    followers: 751;
    following: 414;
    status: '';
    canDm: true;
    canMediaTag: true;
    createdAt: 'Sat Aug 23 13:55:28 +0000 2025';
    entities: {
      description: unknown;
      url: {
        urls: [
          {
            display_url: 'axiom.trade/@fair69';
            expanded_url: 'https://axiom.trade/@fair69';
            indices: [0, 23];
            url: 'https://t.co/kp1onS5Gp5';
          },
        ];
      };
    };
    fastFollowersCount: 0;
    favouritesCount: 0;
    hasCustomTimelines: true;
    isTranslator: false;
    mediaCount: 20;
    statusesCount: 161;
    withheldInCountries: [];
    affiliatesHighlightedLabel: unknown;
    possiblySensitive: false;
    pinnedTweetIds: ['1961411871933677703'];
    profile_bio: {
      description: 'Onchain magician. 中国量化. NFA. DYOR.';
      entities: {
        description: unknown;
        url: {
          urls: [
            {
              display_url: 'axiom.trade/@fair69';
              expanded_url: 'https://axiom.trade/@fair69';
              indices: [0, 23];
              url: 'https://t.co/kp1onS5Gp5';
            },
          ];
        };
      };
      withheld_in_countries: [];
    };
    isAutomated: false;
    automatedBy: null;
  };
  extendedEntities?: {
    media?: [
      {
        allow_download_status: {
          allow_download: true;
        };
        display_url: 'pic.twitter.com/EllVK6mZC9';
        expanded_url: 'https://twitter.com/fairtrades69/status/1998768968333668623/photo/1';
        ext_media_availability: {
          status: 'Available';
        };
        features: {
          large: {
            faces: [
              {
                h: 48;
                w: 48;
                x: 384;
                y: 62;
              },
              {
                h: 68;
                w: 68;
                x: 420;
                y: 45;
              },
            ];
          };
          orig: {
            faces: [
              {
                h: 48;
                w: 48;
                x: 384;
                y: 62;
              },
              {
                h: 68;
                w: 68;
                x: 420;
                y: 45;
              },
            ];
          };
        };
        id_str: '1998766179922427905';
        indices: [234, 257];
        media_key: '3_1998766179922427905';
        media_results: {
          id: 'QXBpTWVkaWFSZXN1bHRzOgwAAQoAARu9C0AvV0ABCgACG70NyWmaMQ8AAA==';
          result: {
            __typename: 'ApiMedia';
            id: 'QXBpTWVkaWE6DAABCgABG70LQC9XQAEKAAIbvQ3JaZoxDwAA';
            media_key: '3_1998766179922427905';
          };
        };
        media_url_https: 'https://pbs.twimg.com/media/G70LQC9XQAERTcs.png';
        original_info: {
          focus_rects: [
            {
              h: 232;
              w: 414;
              x: 103;
              y: 0;
            },
            {
              h: 232;
              w: 232;
              x: 194;
              y: 0;
            },
            {
              h: 232;
              w: 204;
              x: 208;
              y: 0;
            },
            {
              h: 232;
              w: 116;
              x: 252;
              y: 0;
            },
            {
              h: 232;
              w: 592;
              x: 0;
              y: 0;
            },
          ];
          height: 232;
          width: 592;
        };
        sizes: {
          large: {
            h: 232;
            w: 592;
          };
        };
        type: 'photo';
        url: 'https://t.co/EllVK6mZC9';
      },
    ];
  };
  card: unknown;
  place: unknown;
  entities?: {
    symbols?: [
      {
        indices: [0, 6];
        text: 'CLARK';
      },
    ];
    urls?: [
      {
        display_url: 'wallet.coinbase.com/home/create';
        expanded_url: 'https://wallet.coinbase.com/home/create';
        indices: [49, 72];
        url: 'https://t.co/L3r0I7HByC';
      },
    ];
    user_mentions?: [
      {
        id_str: '232022923';
        indices: [0, 9];
        name: 'Goated';
        screen_name: 'Goated0x';
      },
      {
        id_str: '926902989679415296';
        indices: [10, 22];
        name: 'Phletchy';
        screen_name: 'PhletchyIRL';
      },
    ];
    hashtags?: [
      {
        indices: [34, 44];
        text: 'animation';
      },
      {
        indices: [61, 68];
        text: 'French';
      },
      {
        indices: [87, 99];
        text: 'Intermarché';
      },
    ];
  };
  isRetweet: boolean;
  isQuote: boolean;
  isConversationControlled: boolean;
  quoted_tweet: TweetV2;
  retweeted_tweet: TweetV2;
  isLimitedReply: boolean;
}
