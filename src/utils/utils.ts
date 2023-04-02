import { VerificationStatus } from "types/kyc";
import packageJson from "../../package.json";

export const getCurrentVersion = (): string => {
  return packageJson.version;
};

export const isStage = (): boolean => {
  return window.location.host.includes("stage-");
};

export const isDev = (): boolean => {
  return window.location.host.includes("dev-");
};

export const isLocal = (): boolean => {
  return window.location.host.includes("localhost:");
};

export const floatData = (data: number | string, number = 2) => {
  if (data) return parseFloat(data.toString()).toFixed(number);
  return 0;
};

export const convertDate = (date = new Date()) => {
  return date.toISOString().split("T")[0];
};

export const getKycLevelStatusColor = (
  status: VerificationStatus | undefined
) => {
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

export const getMinMaxArray = (key: string, array: []) => {
  // const min = JSON.stringify(
  //   array.reduce(function (prev, current) {
  //     return parseInt(prev[key]) < parseInt(current[key]) ? prev : current;
  //   }),
  // );

  // const max = JSON.stringify(
  //   array.reduce(function (prev, current) {
  //     return parseInt(prev[key]) > parseInt(current[key]) ? prev : current;
  //   }),
  // );

  const min = Math.min(...array.map((item) => parseFloat(item[key])));
  const max = Math.max(...array.map((item) => parseFloat(item[key])));

  // const min = array.length ? minBy(array, key)![key] : 0;
  // const max = array.length ? maxBy(array, key)![key] : 0;
  return { min, max };
};

export const isPendingOrRejected = (
  status: VerificationStatus | undefined
): boolean => {
  switch (status) {
    case VerificationStatus.PENDING:
      return true;
    case VerificationStatus.REJECTED:
      return true;

    default:
      return false;
  }
};
