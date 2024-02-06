import { bxRightArrowAlt } from 'boxicons-quasar';
import { usePairSignalers, type SignalerPair } from 'api/signaler';
import Icon from 'shared/Icon';
import Button from 'shared/Button';
import Spinner from 'shared/Spinner';
import ActivePosition from '../ActivePosition';

const CoinSignalersList: React.FC<{ coin: SignalerPair }> = ({ coin }) => {
  const { data, isLoading } = usePairSignalers(coin.base.name, coin.quote.name);

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      {data.map(s => (
        <div className="rounded-2xl bg-white/5 p-3" key={s.strategy.key}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mx-3 text-2xl">
                {s.strategy.profile.title || s.strategy.name}
              </h2>
            </div>

            <div className="flex items-center">
              <Button>
                Explore
                <Icon name={bxRightArrowAlt} />
              </Button>
            </div>
          </div>

          <ActivePosition signaler={s} />
        </div>
      ))}
    </div>
  );
};

export default CoinSignalersList;
