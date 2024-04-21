import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';

export const useSumsubVerified = () =>
  useQuery(['ssLevels'], async () => {
    const { data } = await axios.get<{
      results: Array<{
        status: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
      }>;
    }>(`${ACCOUNT_PANEL_ORIGIN}/api/v1/kyc/user-kyc-levels`);
    return data.results?.[0]?.status || 'UNVERIFIED';
  });

// const levelName = 'basic-kyc-level';
const levelName = 'Onlineident natural person';

export const getSumsubToken = async () => {
  const { data } = await axios.get<{ token: string }>(
    `${ACCOUNT_PANEL_ORIGIN}/api/v1/kyc/sumsub-access-token?level_name=${levelName}`,
  );
  return data.token;
};
