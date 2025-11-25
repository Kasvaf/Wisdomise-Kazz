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
    entities: {
      description: unknown;
    };
    protected: boolean;
    isVerified: boolean;
    isBlueVerified: boolean;
    verifiedType: unknown;
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
