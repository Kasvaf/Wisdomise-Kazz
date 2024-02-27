import { type SubscriptionItem } from './subscription';

export interface Account {
  key: string;
  email: string;
  nickname?: string;
  referral_code: string;
  referrer?: any;
  info: Info;
  telegram_id?: string;
  telegram_code?: string;
  terms_and_conditions_accepted: boolean;
  privacy_policy_accepted: boolean;
  register_status: string;
  stripe_customer_id?: any;
  subscription_item?: SubscriptionItem;
  referred_users_count: number;
  active_referred_users_count: number;
  daily_magic_enabled: boolean;
  wisdomise_verification_status:
    | 'UNVERIFIED'
    | 'SET_CALENDLY_MEETING'
    | 'VERIFIED';
  wallet_address?: `0x${string}`;
  wsdm_balance?: number;
  hub_spot_token: string;
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
