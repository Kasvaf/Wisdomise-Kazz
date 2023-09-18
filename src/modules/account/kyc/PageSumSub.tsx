import SumsubWebSdk from '@sumsub/websdk-react';
import { useQuery } from '@tanstack/react-query';
import { notification } from 'antd';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { unwrapErrorMessage } from 'utils/error';
import { getSumsubToken, useUserInfoQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';

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

  return (
    <PageWrapper loading={user.isLoading || token.isLoading}>
      {token.data && (
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
      )}
    </PageWrapper>
  );
}
