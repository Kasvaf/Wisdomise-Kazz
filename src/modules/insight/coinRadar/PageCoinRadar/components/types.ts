import { type useCoinSignals } from 'api';

export type SocialRadarTableParams = NonNullable<
  Required<Parameters<typeof useCoinSignals>[0]>
>;
