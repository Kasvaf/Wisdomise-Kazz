export type Benefit = {
  title: string;
  description: string | string[];
};

export type Requirements = {
  title: string;
  description: string | string[];
};

export enum VerificationStatus {
  UNVERIFIED = "UNVERIFIED",
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export interface KYC_Level {
  key: string;
  name: string;
  created_at: string;
  order: number;
  updated_at: string;
  benefits: Benefit[];
  requirements: Requirements[];
}

export interface VerificationCardProps extends Omit<KYC_Level, "key" | "order" | "updated_at" | "created_at" | "name"> {
  title: string;
  onVerify: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  status: VerificationStatus | undefined;
}

export type KYC_level_binding = {
  kyc_level: Pick<KYC_Level, "key" | "name">;
  status: VerificationStatus;
};

export interface API_list_response<K> {
  count: number;
  next: null;
  previous: null;
  results: K[];
}
