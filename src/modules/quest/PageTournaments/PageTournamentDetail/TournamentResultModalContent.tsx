import {
  useTournamentClaimMutation,
  useTournamentProfileQuery,
} from 'api/tournament';
import bg from 'modules/account/PageRewards/RewardModal/images/bg.png';
import usdc from 'modules/account/PageRewards/RewardModal/images/usdc.svg';
import video from 'modules/account/PageRewards/RewardModal/images/video.webm';
import { Button } from 'shared/v1-components/Button';

export default function TournamentResultModalContent({
  onResolve,
  tournamentKey,
}: {
  onResolve: VoidFunction;
  tournamentKey: string;
}) {
  const { data: me } = useTournamentProfileQuery(tournamentKey);
  const { mutateAsync, isPending } = useTournamentClaimMutation();

  const claim = () => {
    void mutateAsync(tournamentKey).then(() => {
      return onResolve();
    });
  };

  return (
    <div className="flex flex-col items-center">
      <img
        alt=""
        className="absolute end-0 top-0 size-full mobile:rounded-3xl rounded-xl"
        src={bg}
      />
      <video
        autoPlay
        className="absolute top-0 size-full object-cover opacity-50 mix-blend-exclusion"
        muted
        playsInline
      >
        <source src={video} />
      </video>

      <div className="relative flex flex-col items-center text-center">
        <h1 className="mb-8 font-semibold text-3xl italic">Congratulations!</h1>
        <p className="w-72">
          The tournament is finished, and you’ve won a prize!
        </p>
        <p className="mt-6">Rewards</p>

        <div className="my-4 flex items-stretch justify-center gap-3">
          {me?.result?.reward_items?.map(i => (
            <div
              className="flex flex-col rounded-lg border border-v1-border-primary/20 p-6 text-center"
              key={i.symbol_slug}
              style={{
                background:
                  'linear-gradient(90deg, rgba(190, 81, 215, 0.10) 0%, rgba(45, 163, 214, 0.10) 100%)',
              }}
            >
              <div className="my-3 flex items-center gap-1">
                <img alt="usdt" className="size-8 w-auto" src={usdc} />
                <span className="font-semibold text-4xl">{i.amount}</span>
              </div>
              <hr className="mt-auto mb-3 border border-v1-border-primary/20" />
              <div>USDC</div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-v1-content-secondary text-xs">
          To withdraw your token, please go to rewards page and follow the
          instructions.
        </p>
      </div>
      <Button
        className="mt-3 w-full max-w-md"
        loading={isPending}
        onClick={claim}
        variant="white"
      >
        Claim
      </Button>
    </div>
  );
}
