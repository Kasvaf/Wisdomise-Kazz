export interface UserInfoResponse {
  key: string;
  user: User;
  account: Account;
  kyc_level_bindings: any[];
}

interface Account {
  key: string;
  email: string;
  nickname?: string;
  referral_code: string;
  referrer?: any;
  info: Info;
  terms_and_conditions_accepted: boolean;
  privacy_policy_accepted: boolean;
  register_status: string;
  stripe_customer_id?: any;
  subscription?: Subscription;
  referred_users_count: number;
  active_referred_users_count: number;
  wisdomise_verification_status:
    | 'UNVERIFIED'
    | 'SET_CALENDLY_MEETING'
    | 'VERIFIED';
}

interface Subscription {
  object?: {
    object: string;
    status: string;
    plan: {
      key: string;
      name: string;
      metadata: {
        athena_questions_count: number;
        athena_daily_notifications_count: number;
      };
    };
  };
}

interface User {
  email: string;
}

interface Info {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  sid: string;
  sub: string;
  name: string;
  email: string;
  nonce: string;
  picture: string;
  nickname: string;
  updated_at: string;
  email_verified: boolean;
}
