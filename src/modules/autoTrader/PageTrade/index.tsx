import { bxLeftArrowAlt } from 'boxicons-quasar';
import { useNavigate, useParams } from 'react-router-dom';
import AdvancedSignalForm from 'modules/builder/signaler/PageSignalerDetails/TabTerminal/AdvancedSignalForm';
import useSignalFormStates from 'modules/builder/signaler/PageSignalerDetails/TabTerminal/AdvancedSignalForm/useSignalFormStates';
import { CoinSelect } from 'modules/account/PageAlerts/components/CoinSelect';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { useCoinOverview } from 'api';
import Spinner from 'shared/Spinner';

export default function PageTrade() {
  const formState = useSignalFormStates();
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');
  const navigate = useNavigate();
  const coinOverview = useCoinOverview({ slug });
  const abbr = coinOverview?.data?.symbol.abbreviation;

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

      {coinOverview.isLoading && (
        <div className="my-8 flex justify-center">
          <Spinner />
        </div>
      )}

      {abbr && (
        <AdvancedSignalForm
          assetName={`${abbr ?? ''}USDT`}
          assetSlug={slug}
          activePosition={undefined}
          className="max-w-[33.33333%] basis-1/3 mobile:max-w-full"
          formState={formState}
        />
      )}
    </div>
  );
}
