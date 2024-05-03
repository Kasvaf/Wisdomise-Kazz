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
export const angelReleaseTimestamps = Array.from(
  { length: ANGEL_ROUND_VESTING_LENGTH },
  (_, i) => ANGEL_ROUND_VESTING_START + VESTING_INTERVAL * i,
);
export const angelReleasePercentage =
  (1 - FIRST_ANGEL_RELEASE_PERCENTAGE) / angelReleaseTimestamps.length;

const STRATEGIC_ROUND_VESTING_START = 1_714_725_300;
const STRATEGIC_ROUND_VESTING_LENGTH = 450;
const FIRST_STRATEGIC_RELEASE_PERCENTAGE = 0.05;
export const strategicReleaseTimestamps = Array.from(
  { length: STRATEGIC_ROUND_VESTING_LENGTH },
  (_, i) => STRATEGIC_ROUND_VESTING_START + VESTING_INTERVAL * i,
);
export const strategicReleasePercentage =
  (1 - FIRST_STRATEGIC_RELEASE_PERCENTAGE) / strategicReleaseTimestamps.length;
