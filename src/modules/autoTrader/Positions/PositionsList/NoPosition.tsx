import { NavLink } from 'react-router-dom';
import empty from './empty.svg';

const NoPosition: React.FC<{ active: boolean; slug?: string }> = ({
  active,
  slug,
}) => {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center pb-5 text-center">
      <img className="my-4" src={empty} />
      <h1 className="font-semibold">
        {active ? 'No active positions yet!' : 'No position yet!'}
      </h1>

      {slug ? (
        <p className="mt-3 w-3/4 text-xs">
          {active
            ? 'Get started by creating a position. Your active trades will appear here!'
            : 'Get started by creating your first position. Your trades history will appear here!'}
        </p>
      ) : (
        <div className="mt-4 px-1 text-justify font-light text-sm">
          <p>
            To start trading, select a coin or visit the{' '}
            <NavLink className="text-v1-content-link" to="/">
              Home
            </NavLink>{' '}
            page to explore hot coins and trade them.
          </p>

          <ul className="mt-2 flex list-disc flex-col gap-2 pl-4 opacity-75">
            <li>
              <strong>
                Trading is only available on{' '}
                <span className="text-v1-content-positive">Solana</span> &
                <span className="text-v1-content-positive"> TON </span>
                networks.
              </strong>{' '}
              We list all trending and hot coins in our radars and home page,
              but some of them may not be tradeable.
            </li>
            <li>
              <strong>Wallets vary by network.</strong> You may need a different
              wallet depending on the coin’s blockchain.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NoPosition;
