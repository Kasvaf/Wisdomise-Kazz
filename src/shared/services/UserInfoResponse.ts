export interface UserInfoResponse {
  key: string;
  customer: Customer;
}

interface Customer {
  key: string;
  user: User;
  nickname: string;
  referral_code: string;
  referrer: any;
  info: Info;
  terms_and_conditions_accepted: boolean;
  privacy_policy_accepted: boolean;
  register_status: string;
  referees_count: number;
  active_referees_count: number;
  referral_level_bindings: any[];
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
