import { VerificationStatus } from "types/kyc";

export const isProduction = !window.location.host.includes("stage-") && !window.location.host.includes("localhost");

export const isStage = (): boolean => {
  return window.location.host.includes("stage-");
};

export const isLocal = (): boolean => {
  return window.location.host.includes("localhost:");
};

export const floatData = (data?: number | string, number = 2) => {
  if (data) return parseFloat(data.toString()).toFixed(number);
  return 0;
};

export const convertDate = (date = new Date()) => {
  return date.toISOString().split("T")[0];
};

export const getKycLevelStatusColor = (status: VerificationStatus | undefined) => {
  switch (status) {
    case VerificationStatus.REJECTED:
      return "error";
    case VerificationStatus.PENDING:
      return "warn";
    case VerificationStatus.VERIFIED:
      return "success";
    default:
      return "default";
  }
};

export const isPendingOrRejected = (status: VerificationStatus | undefined): boolean => {
  switch (status) {
    case VerificationStatus.PENDING:
      return true;
    case VerificationStatus.REJECTED:
      return true;

    default:
      return false;
  }
};

export const roundDown = (number: number, decimals = 2) => {
  decimals = decimals || 0;
  return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
};
