import SumsubWebSdk from '@sumsub/websdk-react';
import { useQuery } from '@tanstack/react-query';
import { Spin, notification } from 'antd';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { unwrapErrorMessage } from 'utils/error';
import { getSumsubToken, useUserInfoQuery } from 'api';

const errorHandler = (e: unknown) =>
  notification.error({ message: unwrapErrorMessage(e) });

export default function SumSubPage() {
  const navigate = useNavigate();
  const user = useUserInfoQuery();
  const token = useQuery([], getSumsubToken);

  const msgHandler = useCallback(
    (type: string) => {
      if (type === 'idCheck.applicantReviewComplete') {
        navigate('/kyc');
      }
    },
    [navigate],
  );

  if (user.isLoading || token.isLoading)
    return (
      <div className="flex justify-center">
        <Spin />
      </div>
    );
  if (!token.data) return <></>;

  return (
    <SumsubWebSdk
      accessToken={token.data}
      expirationHandler={getSumsubToken}
      config={{
        email: user.data?.account.email,
      }}
      options={{}}
      onMessage={msgHandler}
      onError={errorHandler}
    />
  );
}
