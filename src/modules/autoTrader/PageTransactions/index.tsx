import { useNavigate, useParams } from 'react-router-dom';
import { bxLeftArrowAlt } from 'boxicons-quasar';
import React from 'react';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { useTraderPositionTransactionsQuery } from 'api';
import Spinner from 'shared/Spinner';
import TransactionBox from './TransactionBox';
import { ReactComponent as ArrowUp } from './ArrowUp.svg';

export default function PageTransactions() {
  const { slug } = useParams<{ slug: string }>();
  const [positionKey] = useSearchParamAsState('key');
  if (!slug) throw new Error('unexpected');
  const navigate = useNavigate();

  const { data, isLoading } = useTraderPositionTransactionsQuery({
    positionKey,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-3 flex items-center gap-2">
        <Button
          variant="alternative"
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center !px-3 !py-0"
        >
          <Icon name={bxLeftArrowAlt} />
        </Button>

        <div className="grow pr-4 text-center text-base font-medium">
          Transactions History
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <Spinner />
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
