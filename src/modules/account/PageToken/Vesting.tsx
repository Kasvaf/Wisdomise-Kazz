import { useMemo } from 'react';
import Button from 'shared/Button';
import Card from 'shared/Card';
import {
  useAngelRoundAccountShares,
  useAngelRoundReleasable,
  useStrategicRoundAccountShares,
  useStrategicRoundReleasable,
} from 'modules/account/PageToken/web3/tokenDistributerContract';
import { addComma } from 'utils/numbers';
import { ReactComponent as LockIcon } from './icons/lock.svg';

export default function Vesting() {
  const { data: angelRoundTotalAmount } = useAngelRoundAccountShares();
  const { data: angelRoundClaimable } = useAngelRoundReleasable();

  const { data: strategicRoundTotalAmount } = useStrategicRoundAccountShares();
  const { data: strategicRoundClaimable } = useStrategicRoundReleasable();

  const roundDetails = useMemo(() => {
    return [
      {
        name: 'Angel Round',
        date: 'Q3 2023',
        totalAmount: angelRoundTotalAmount,
        claimable: angelRoundClaimable,
      },
      {
        name: 'Strategic Round',
        date: 'Q1 2024',
        totalAmount: strategicRoundTotalAmount,
        claimable: strategicRoundClaimable,
      },
    ];
  }, [
    angelRoundClaimable,
    angelRoundTotalAmount,
    strategicRoundClaimable,
    strategicRoundTotalAmount,
  ]);

  return (
    <Card className="relative mt-6">
      <LockIcon className="absolute right-0 top-0 m-7" />
      <h2 className="mb-2 text-2xl font-medium">Vesting</h2>
      <p className="pb-3 text-white/40">Wallet transactions and balance</p>
      {roundDetails.map(round => {
        return (
          <div
            key={round.name}
            className="my-3 flex items-center justify-between rounded-xl bg-[rgba(51,59,92,0.20)] p-3"
          >
            <div>
              <h3 className="mb-2 font-bold italic">{round.name}</h3>
              <span className="text-sm text-white/40">{round.date}</span>
            </div>
            <div className="me-8 h-10 !w-px bg-white/10"></div>
            <div>
              <div className="mb-3 text-sm text-white/40">
                <span>Total Amount</span>
              </div>
              <div>
                <span>{addComma((round.totalAmount ?? 0n) / 10n ** 6n)}</span>{' '}
                <span>WSDM</span>
              </div>
            </div>
            <div>
              <div className="mb-3">
                <span className="text-sm text-white/40">Next unlock</span>
                <span className="ms-2">in 365 days</span>
              </div>
              <div>
                <span className="text-white/40">50%</span>
                <span className="ms-3">
                  {addComma((round.totalAmount ?? 0n) / 10n ** 6n / 2n)} WSDM
                </span>
              </div>
            </div>
            <div>
              <div className="mb-3 text-sm text-white/40">
                <span>Claimable</span>
              </div>
              <div>
                <span className="text-white/40">
                  {Number(
                    ((round.claimable ?? 0n) / (round.totalAmount || 1n)) *
                      100n,
                  )}
                  %
                </span>{' '}
                <span className="ms-3">
                  {addComma((round.claimable ?? 0n) / 10n ** 6n)} WSDM
                </span>
              </div>
            </div>
            <Button
              variant="alternative"
              className="bg-gradient-to-bl from-[rgba(97,82,152,0.40)] from-15% to-[rgba(66,66,123,0.40)] to-75%"
              disabled={(round.claimable ?? 0n) === 0n}
            >
              Claim
            </Button>
          </div>
        );
      })}
    </Card>
  );
}
