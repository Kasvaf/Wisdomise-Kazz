import { RiskType } from "api/types/common";

type ProfilesList = {
  [key in RiskType]: {
    name: string;
    title: string;
    type: RiskType;
  };
};

export const profiles: ProfilesList = {
  low: {
    name: "Low",
    title: "Low Risk Profile",
    type: "low",
  },
  medium: {
    name: "Medium",
    title: "Medium Risk Profile",
    type: "medium",
  },
  high: {
    name: "High",
    title: "High Risk Profile",
    type: "high",
  },
};

export const weightsColors = [
  "#920BD2", // BTC
  "#F55353", // ETH
  "#F58B5F", // BNB
  "#FF449F", // LTC
  "#FFF5B7", // TRX
  "#00EAD3", // ADA
  "#5800FF", // USDT
  "#920BD2",
  "#F55353",
  "#F58B5F",
];
