import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { type UserInfoResponse } from './types/UserInfoResponse';

export const useUserInfoQuery = () =>
  useQuery<UserInfoResponse>(['user'], async () => {
    const { data } = await axios.get('/account/investors/me');
    return data;
  });

export const useAgreeToTermsMutation = () =>
  useMutation<
    unknown,
    any,
    {
      nickname: string;
      terms_and_conditions_accepted: boolean;
      privacy_policy_accepted: boolean;
      cryptocurrency_risk_disclosure_accepted: boolean;
      referral_code?: string;
    }
  >(body => axios.patch('/account/customers/me', body));

export const useResendVerificationEmailMutation = () =>
  useMutation<unknown, any>(body =>
    axios.post('/account/customers/me/verification-email', body),
  );
