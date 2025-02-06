import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CoinSelect } from 'modules/alert/components/CoinSelect';
import {
  isPositionUpdatable,
  useCoinDetails,
  useTraderPositionQuery,
} from 'api';
import Spinner from 'shared/Spinner';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import BtnBack from '../layout/BtnBack';
import useActiveNetwork from '../layout/useActiveNetwork';
import useEnsureIsSupportedPair from '../useEnsureIsSupportedPair';
import useSignalFormStates from './AdvancedSignalForm/useSignalFormStates';
import AdvancedSignalForm from './AdvancedSignalForm';

export default function PageTrade() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');

  useEnsureIsSupportedPair({ slug, nextPage: '/trader-hot-coins' });

  const [positionKey] = useSearchParamAsState('pos');
  const position = useTraderPositionQuery({
    positionKey,
    network: useActiveNetwork(),
  });
  const coinOverview = useCoinDetails({ slug });

  useEffect(() => {
    if (position.data && !isPositionUpdatable(position.data)) {
      navigate(`/trader-hot-coins/${slug}`);
    }
  }, [navigate, position.data, slug]);

  const formState = useSignalFormStates();

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <BtnBack />
        <CoinSelect
          className="w-full"
          filterTokens={x => x !== 'tether'}
          priceExchange="auto"
          value={slug}
          onChange={selectedSlug =>
            navigate({
              pathname: `/market/${selectedSlug}`,
              search: 'quote=' + formState.quote[0],
            })
          }
          mini={false}
        />
      </div>

      {coinOverview.isLoading || (positionKey && position.isLoading) ? (
        <div className="my-8 flex justify-center">
          <Spinner />
        </div>
      ) : (
        (!positionKey || !!position.data) && (
          <AdvancedSignalForm
            baseSlug={slug}
            activePosition={position.data}
            className="max-w-full basis-1/3"
            formState={formState}
          />
        )
      )}
    </div>
  );
}
