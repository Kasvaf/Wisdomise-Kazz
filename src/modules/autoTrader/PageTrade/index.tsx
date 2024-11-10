import { bxLeftArrowAlt } from 'boxicons-quasar';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CoinSelect } from 'modules/account/PageAlerts/components/CoinSelect';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import {
  isPositionUpdatable,
  useCoinOverview,
  useTraderPositionQuery,
} from 'api';
import Spinner from 'shared/Spinner';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import useSignalFormStates from './AdvancedSignalForm/useSignalFormStates';
import AdvancedSignalForm from './AdvancedSignalForm';

export default function PageTrade() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');

  const [positionKey] = useSearchParamAsState('pos');
  const position = useTraderPositionQuery(positionKey);
  const coinOverview = useCoinOverview({ slug });
  const abbr = coinOverview?.data?.symbol.abbreviation;

  useEffect(() => {
    if (position.data && !isPositionUpdatable(position.data)) {
      navigate(`/hot-coins/${slug}`);
    }
  }, [navigate, position.data, slug]);

  const formState = useSignalFormStates();

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <Button
          variant="alternative"
          onClick={() => navigate('/hot-coins')}
          className="!px-3 !py-0"
        >
          <Icon name={bxLeftArrowAlt} />
        </Button>
        <CoinSelect
          networkName="ton"
          className="w-full"
          filterTokens={x => x !== 'tether'}
          showPrice
          value={slug}
          onChange={selectedSlug => navigate(`/market/${selectedSlug}`)}
        />
      </div>

      {coinOverview.isLoading || (positionKey && position.isLoading) ? (
        <div className="my-8 flex justify-center">
          <Spinner />
        </div>
      ) : (
        abbr &&
        (!positionKey || !!position.data) && (
          <AdvancedSignalForm
            assetName={`${abbr ?? ''}USDT`}
            assetSlug={slug}
            activePosition={position.data}
            className="max-w-[33.33333%] basis-1/3 mobile:max-w-full"
            formState={formState}
          />
        )
      )}
    </div>
  );
}
