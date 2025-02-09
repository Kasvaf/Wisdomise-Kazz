import React from 'react';
import { useParams } from 'react-router-dom';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { useTraderPositionTransactionsQuery } from 'api';
import Spinner from 'shared/Spinner';
import BtnBack from '../../base/BtnBack';
import TransactionBox from './TransactionBox';
import { ReactComponent as ArrowUp } from './ArrowUp.svg';

export default function PageTransactions() {
  const { slug } = useParams<{ slug: string }>();
  const [positionKey] = useSearchParamAsState('key');
  if (!slug) throw new Error('unexpected');

  const { data, isError, isLoading } = useTraderPositionTransactionsQuery({
    positionKey,
    // network:, // TODO: HOW?!
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-3 flex items-center gap-2">
        <BtnBack />
        <div className="grow pr-4 text-center text-base font-medium">
          Transactions History
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="rounded-md border border-v1-border-negative p-2">
          {"There's a problem with our servers. Please check again later."}
        </div>
      ) : (
        <div className="flex flex-col items-stretch gap-2">
          {data?.toReversed().map((t, ind) => (
            <React.Fragment key={t.type + t.data.time}>
              <TransactionBox t={t} />
              {ind < data.length - 1 && (
                <ArrowUp className="self-center text-[#333F4D]" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
