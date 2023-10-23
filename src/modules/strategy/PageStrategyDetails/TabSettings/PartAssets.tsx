import { clsx } from 'clsx';
import { bxPlus, bxX } from 'boxicons-quasar';
import Button from 'modules/shared/Button';
import Icon from 'modules/shared/Icon';
import PairInfo from 'modules/shared/PairInfo';
import { type StrategyAsset } from 'api';
import TitleHint from '../../TitleHint';

interface Props {
  value: StrategyAsset[];
  onChange?: (assets: StrategyAsset[]) => unknown;
  className?: string;
}

const PartAssets: React.FC<Props> = ({ value, className }) => {
  return (
    <section className={className}>
      <div className="flex items-center justify-between">
        <TitleHint title="Assets">
          Choose a cryptocurrency and percentage to trade
        </TitleHint>

        <Button variant="secondary">
          <span className="mr-2">Add Coin</span>
          <Icon name={bxPlus} />
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-6">
        {value.map(ab => (
          <div
            key={ab.asset.name}
            className="flex items-center justify-between rounded-lg bg-black/20 p-4"
          >
            <PairInfo
              base={ab.asset.symbol}
              quote={ab.asset.name.split('/')[1]}
              title="Bitcoin"
            />

            <div className="flex items-center">
              <input
                className="inline-block w-10 rounded-lg bg-black/60 p-2"
                value={ab.share}
              />
              <span className="ml-1">%</span>
            </div>

            <div
              className={clsx(
                'rounded-full p-1',
                'cursor-pointer text-white hover:bg-black/70',
              )}
            >
              <Icon name={bxX} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PartAssets;
