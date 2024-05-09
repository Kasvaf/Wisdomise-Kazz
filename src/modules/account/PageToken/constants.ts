import { zeroAddress } from 'viem';
import { isProduction } from 'utils/version';

export const MERKLE_DISTRIBUTOR_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0xAc4b19F508bdDfFb9fa4015515EA2Eb804632dE6';

export const LOCKING_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x4792B74D02a60F6019288663eD7f01cB0632dfA2';

export const TOKEN_MIGRATION_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x80C40f6d0995457F28b431cd6901B7aCAb00a5D5';

export const ANGEL_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x3F0C2b357322d7d3FF773224Ca8bBF7A7018F92f';

export const STRATEGIC_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x64a6768417B31EB0F2d240f9175e2D12E88382cd';

export const KOL_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x4785E52599e6146C24A7A5f59D89E8d064c2cf4B';

export const INSTITUTIONAL_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x23c48587ede1246707c8e77d46B8B5C4678F7e53';

export const PUBLIC_ROUND_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x56F5D125F899A35f3264B0B6B2942Efaf8858d21';

export const TWSDM_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x0DB3430FF725D9d957749732144Ec791704A058f';

export const WSDM_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0xDCCA28B4938Aa48f15d93555Ed24542A559CE3df';

const VESTING_INTERVAL = 1800;

const ANGEL_ROUND_VESTING_START = 1_714_725_300;
const ANGEL_ROUND_VESTING_LENGTH = 540;
const FIRST_ANGEL_RELEASE_PERCENTAGE = 0.05;
export const angelReleaseTimestamps = calculateReleaseTimestamps(
  ANGEL_ROUND_VESTING_LENGTH,
  ANGEL_ROUND_VESTING_START,
);
export const angelReleasePercentage = calculateReleasePercentage(
  FIRST_ANGEL_RELEASE_PERCENTAGE,
  ANGEL_ROUND_VESTING_LENGTH,
);

const STRATEGIC_ROUND_VESTING_START = 1_714_725_300;
const STRATEGIC_ROUND_VESTING_LENGTH = 450;
const FIRST_STRATEGIC_RELEASE_PERCENTAGE = 0.05;
export const strategicReleaseTimestamps = calculateReleaseTimestamps(
  STRATEGIC_ROUND_VESTING_LENGTH,
  STRATEGIC_ROUND_VESTING_START,
);
export const strategicReleasePercentage = calculateReleasePercentage(
  FIRST_STRATEGIC_RELEASE_PERCENTAGE,
  STRATEGIC_ROUND_VESTING_LENGTH,
);

const KOL_VESTING_START = 1_714_725_300;
const KOL_VESTING_LENGTH = 270;
const FIRST_KOL_RELEASE_PERCENTAGE = 0.05;
export const kolReleaseTimestamps = calculateReleaseTimestamps(
  KOL_VESTING_LENGTH,
  KOL_VESTING_START,
);
export const kolReleasePercentage = calculateReleasePercentage(
  FIRST_KOL_RELEASE_PERCENTAGE,
  KOL_VESTING_LENGTH,
);

const INSTITUTIONAL_VESTING_START = 1_714_728_900;
const INSTITUTIONAL_VESTING_LENGTH = 450;
const FIRST_INSTITUTIONAL_RELEASE_PERCENTAGE = 0;
export const institutionalReleaseTimestamps = calculateReleaseTimestamps(
  INSTITUTIONAL_VESTING_LENGTH,
  INSTITUTIONAL_VESTING_START,
);
export const institutionalReleasePercentage = calculateReleasePercentage(
  FIRST_INSTITUTIONAL_RELEASE_PERCENTAGE,
  INSTITUTIONAL_VESTING_LENGTH,
);

const PUBLIC_ROUND_VESTING_START = 1_715_238_000;
const PUBLIC_ROUND_VESTING_LENGTH = 150;
const FIRST_PUBLIC_RELEASE_PERCENTAGE = 0.12;
export const publicRoundReleaseTimestamps = calculateReleaseTimestamps(
  PUBLIC_ROUND_VESTING_LENGTH,
  PUBLIC_ROUND_VESTING_START,
);
export const publicRoundReleasePercentage = calculateReleasePercentage(
  FIRST_PUBLIC_RELEASE_PERCENTAGE,
  PUBLIC_ROUND_VESTING_LENGTH,
);

function calculateReleaseTimestamps(length: number, startTime: number) {
  return Array.from({ length }, (_, i) => startTime + VESTING_INTERVAL * i);
}

function calculateReleasePercentage(
  firstReleasePercentage: number,
  length: number,
) {
  return (1 - firstReleasePercentage) / length;
}
