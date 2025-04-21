import React from 'react';
import { useParams } from 'react-router-dom';
import {
  useTraderPositionQuery,
  useTraderPositionTransactionsQuery,
} from 'api';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import Spinner from 'shared/Spinner';
import PageWrapper from 'modules/base/PageWrapper';
import TransactionBox from './TransactionBox';
import { ReactComponent as ArrowUp } from './ArrowUp.svg';

export default function PageTransactions() {
  const { slug } = useParams<{ slug: string }>();
  const [positionKey] = useSearchParamAsState('key');
  if (!slug) throw new Error('unexpected');

  const { data: position, isLoading: positionLoading } = useTraderPositionQuery(
    { positionKey },
  );
  const {
    data,
    isError,
    isLoading: transactionsLoading,
  } = useTraderPositionTransactionsQuery({
    positionKey,
  });

  return (
    <PageWrapper hasBack title="Transactions History">
      <div className="flex flex-col gap-4">
        {transactionsLoading || positionLoading ? (
          <div className="mt-8 flex justify-center">
            <Spinner />
          </div>
        ) : isError ? (
          <div className="rounded-md border border-v1-border-negative p-2">
            {"There's a problem with our servers. Please check again later."}
          </div>
        ) : (
          position && (
            <div className="flex justify-center">
              <div className="flex w-full max-w-xl flex-col items-stretch gap-2">
                {data?.toReversed().map((t, ind) => (
                  <React.Fragment key={t.type + t.data.time}>
                    <TransactionBox t={t} p={position} />
                    {ind < data.length - 1 && (
                      <ArrowUp className="self-center text-[#333F4D]" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </PageWrapper>
  );
}
