import { type Coin } from 'api/types/shared';
import { ClickableTooltip } from 'shared/ClickableTooltip';

export function CoinCategoriesLabel({ coin }: { coin: Coin }) {
  if (!coin.categories || coin.categories.length === 0) return null;

  return (
    <ClickableTooltip
      title={
        <ul className="space-y-6">
          {(coin.categories ?? []).map(cat => (
            <li key={cat.coingecko_id}>{cat.name}</li>
          ))}
        </ul>
      }
      disabled={coin.categories.length < 2}
      className="rounded-full bg-v1-content-primary/10 px-3 py-1 text-center text-xxs text-v1-content-primary"
    >
      {
        coin.categories.length === 1
          ? coin.categories[0].name
          : 'Categoeies' /* NAITODO */
      }
    </ClickableTooltip>
  );
}
