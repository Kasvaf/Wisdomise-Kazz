import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { type UserInfoResponse } from './types/UserInfoResponse';

export const useUserInfoQuery = () =>
  useQuery<UserInfoResponse>(['user'], async () => {
    const { data } = await axios.get('/account/investors/me');
    return data;
  });
