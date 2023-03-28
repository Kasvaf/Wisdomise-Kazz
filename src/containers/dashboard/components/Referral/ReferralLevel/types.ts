export interface ISubscriptionFeature {
  key: string;
  title: string;
  description: string;
}
export interface ISubscriptionFeatureBinding {
  key: string;
  description: string;
  subscription_feature: ISubscriptionFeature[];
}

export interface ISubscriptionPlan {
  key: string;
  title: string;
  order: number;
  description: string;
  monthly_fee: number;
  seasonal_fee: number;
  annual_fee: number;
  wisdomise_share_percentage: number;
  subscription_feature_bindings: ISubscriptionFeatureBinding[];
}

export interface ISubscriptionBonus {
  key: string;
  duration_days: number;
  subscription_plan: ISubscriptionPlan;
}

export type ReferralBonus = {
  subscription_bonus: ISubscriptionBonus;
};

export interface IReferralLevel {
  key: string;
  is_active: boolean;
  level: number;
  description: string;
  referred_users: number;
  active_referred_users: number;
  config: unknown;
  bonuses: ReferralBonus[];
}

export type ReferralLevelProps = {
  data: IReferralLevel;
  levelBindings: IReferralLevelBinding[];
  referredUsers: number;
  activeReferredUsers: number;
};

export interface IReferralLevelBinding {
  key: string;
  referral_level: IReferralLevel;
  message: string;
  bonus_bindings: [
    {
      key: string;
      bonus: {
        subscription_bonus: ISubscriptionBonus;
      };
      status: string;
      expiration_date: string;
    },
  ];
}
