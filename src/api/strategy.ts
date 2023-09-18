import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { API_ORIGIN } from 'config/constants';
import { type SignalsResponse } from './types/signalResponse';

export const useSignalsQuery = () =>
  useQuery(['signals'], async () => {
    const { data } = await axios.get<SignalsResponse>(
      `${API_ORIGIN}/api/v0/strategy/last-positions`,
    );
    return data;
  });
