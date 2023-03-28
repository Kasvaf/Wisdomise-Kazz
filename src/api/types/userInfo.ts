import { IReferralLevelBinding } from "containers/dashboard/components/Referral/ReferralLevel/types";
import { KYC_level_binding } from "types/kyc";

export interface UserInfo {
  customer: {
    user: { username: null; email: string };
    key: string;
    referral_code: string;
    referees_count: number;
    active_referees_count: number;
    referrer: string | null;
    info: {
      aud: string;
      exp: number;
      iat: number;
      iss: string;
      sid: string;
      sub: string;
      name: string;
      email: string;
      nonce: string;
      locale: string;
      picture: string;
      nickname: string;
      given_name: string;
      updated_at: string;
      family_name: string;
      email_verified: boolean;
    };
    referral_level_bindings: IReferralLevelBinding[];
  };
  kyc_level_bindings: KYC_level_binding[];
}
