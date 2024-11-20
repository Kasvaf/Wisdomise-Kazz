import { useNavigate, useParams } from 'react-router-dom';
import { bxLeftArrowAlt } from 'boxicons-quasar';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { useTraderPositionTransactionsQuery } from 'api';

export default function PageTransactions() {
  const { slug } = useParams<{ slug: string }>();
  const [positionKey] = useSearchParamAsState('key');
  if (!slug) throw new Error('unexpected');
  const navigate = useNavigate();

  useTraderPositionTransactionsQuery({ positionKey });

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
    </div>
  );
}
