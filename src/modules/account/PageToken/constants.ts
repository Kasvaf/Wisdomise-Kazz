import { zeroAddress } from 'viem';
import { isProduction } from 'utils/version';

export const WSDM_IS_ACTIVE =
  !isProduction || Date.now() > Date.UTC(2024, 4, 14, 11, 15);

export const MERKLE_DISTRIBUTOR_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0xAc4b19F508bdDfFb9fa4015515EA2Eb804632dE6';

export const LOCKING_CONTRACT_ADDRESS = isProduction
  ? '0x32De11070594b28640dF060D77Baf9fBE12f5Ee7'
  : '0x4792B74D02a60F6019288663eD7f01cB0632dfA2';

export const TOKEN_MIGRATION_CONTRACT_ADDRESS = isProduction
  ? '0xB193A7c5228eC10eBe683ED226cA39b76376D254'
  : '0x80C40f6d0995457F28b431cd6901B7aCAb00a5D5';

export const ANGEL_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS = isProduction
  ? '0x0Bd0208B6F5DF51A80Df21cea6cf2c7052BcF6d7'
  : '0x3F0C2b357322d7d3FF773224Ca8bBF7A7018F92f';

export const STRATEGIC_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS = isProduction
  ? '0xDB8D04297f8A5d2b2fc4ef237C88DCf75876804A'
  : '0x64a6768417B31EB0F2d240f9175e2D12E88382cd';

export const KOL_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS = isProduction
  ? '0x018e7eD98c24655Be12EB623257E02A5b696eA35'
  : '0x4785E52599e6146C24A7A5f59D89E8d064c2cf4B';

export const INSTITUTIONAL_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS = isProduction
  ? '0x4eB7191f55c5F319561948B64777D530a6a9d949'
  : '0x23c48587ede1246707c8e77d46B8B5C4678F7e53';

export const PUBLIC_ROUND_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS = isProduction
  ? '0x62f2D81C1A9a6FC5dB7850ca6a1e7d5dFbE5D997'
  : '0x56F5D125F899A35f3264B0B6B2942Efaf8858d21';

export const TWSDM_CONTRACT_ADDRESS = isProduction
  ? '0x0f4E2F0B6E9F5EA97D2F959F6a3B4534D03f1404'
  : '0x0DB3430FF725D9d957749732144Ec791704A058f';

export const WSDM_CONTRACT_ADDRESS = isProduction
  ? '0x5F2F8818002dc64753daeDF4A6CB2CcB757CD220'
  : '0xDCCA28B4938Aa48f15d93555Ed24542A559CE3df';

const VESTING_INTERVAL = 3600;

const ANGEL_ROUND_VESTING_START = isProduction ? 1_731_237_300 : 1_714_725_300;
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

const STRATEGIC_ROUND_VESTING_START = isProduction
  ? 1_731_237_300
  : 1_714_725_300;
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

const KOL_VESTING_START = isProduction ? 1_720_869_300 : 1_714_725_300;
const KOL_VESTING_LENGTH = 270;
const FIRST_KOL_RELEASE_PERCENTAGE = isProduction ? 0.12 : 0.05;
export const kolReleaseTimestamps = calculateReleaseTimestamps(
  KOL_VESTING_LENGTH,
  KOL_VESTING_START,
);
export const kolReleasePercentage = calculateReleasePercentage(
  FIRST_KOL_RELEASE_PERCENTAGE,
  KOL_VESTING_LENGTH,
);

const INSTITUTIONAL_VESTING_START = isProduction
  ? 1_726_053_300
  : 1_714_728_900;
const INSTITUTIONAL_VESTING_LENGTH = isProduction ? 360 : 450;
const FIRST_INSTITUTIONAL_RELEASE_PERCENTAGE = 0;
export const institutionalReleaseTimestamps = calculateReleaseTimestamps(
  INSTITUTIONAL_VESTING_LENGTH,
  INSTITUTIONAL_VESTING_START,
);
export const institutionalReleasePercentage = calculateReleasePercentage(
  FIRST_INSTITUTIONAL_RELEASE_PERCENTAGE,
  INSTITUTIONAL_VESTING_LENGTH,
);

const PUBLIC_ROUND_VESTING_START = isProduction ? 1_718_277_300 : 1_715_238_000;
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
