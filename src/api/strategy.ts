import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { isProduction } from 'utils/version';
import { type SignalsResponse } from './types/signalResponse';

export const useSignalsQuery = () =>
  useQuery(['signals'], async () => {
    const { data } = await axios.get<SignalsResponse>(
      `https://${
        isProduction ? '' : 'stage-'
      }api.wisdomise.io/api/v0/strategy/last-positions`,
    );
    return data;
  });
