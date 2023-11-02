import SumsubWebSdk from '@sumsub/websdk-react';
import { useQuery } from '@tanstack/react-query';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { unwrapErrorMessage } from 'utils/error';
import { getSumsubToken, useAccountQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';

const errorHandler = (e: unknown) =>
  notification.error({ message: unwrapErrorMessage(e) });

export default function SumSubPage() {
  const navigate = useNavigate();
  const account = useAccountQuery();
  const token = useQuery([], getSumsubToken);

  const msgHandler = (type: string) => {
    if (type === 'idCheck.applicantReviewComplete') {
      navigate('/account/kyc');
    }
  };

  return (
    <PageWrapper loading={account.isLoading || token.isLoading}>
      {token.data && (
        <SumsubWebSdk
          accessToken={token.data}
          expirationHandler={getSumsubToken}
          config={{
            email: account.data?.email,
          }}
          options={{}}
          onMessage={msgHandler}
          onError={errorHandler}
        />
      )}
    </PageWrapper>
  );
}
