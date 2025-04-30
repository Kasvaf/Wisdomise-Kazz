import useLeague from 'modules/quest/PageLeague/useLeague';
import usdc from 'modules/account/PageRewards/RewardModal/images/usdc.svg';
import LeagueIcon from 'modules/quest/PageLeague/LeagueIcon';
import bg from 'modules/account/PageRewards/RewardModal/images/bg.png';
import video from 'modules/account/PageRewards/RewardModal/images/video.webm';
import { Button } from 'shared/v1-components/Button';
import { useLeagueClaimMutation } from 'api/gamification';

export default function LeagueResultModalContent({
  onResolve,
}: {
  onResolve: VoidFunction;
}) {
  const { profile } = useLeague();
  const { mutateAsync, isPending } = useLeagueClaimMutation();

  const claim = () => {
    void mutateAsync().then(() => {
      return onResolve();
    });
  };

  const isChampion =
    profile.promotion_status === 'PROMOTING' &&
    profile.league_slug === profile.result.next_league_slug;

  return (
    <div className="flex flex-col items-center">
      <img
        src={bg}
        alt=""
        className="absolute end-0 top-0 h-full w-full rounded-xl mobile:rounded-3xl"
      />
      {profile.promotion_status === 'PROMOTING' && (
        <video
          muted
          autoPlay
          playsInline
          className="absolute top-0 h-full w-full object-cover opacity-50 mix-blend-exclusion"
        >
          <source src={video} />
        </video>
      )}
      <div className="relative flex flex-col items-center text-center">
        <h1 className="mb-16 text-3xl font-semibold italic">League</h1>
        {profile.promotion_status === 'PROMOTING' ? (
          isChampion ? (
            <>
              <h2 className="mb-3 text-2xl font-semibold">
                <span className="bg-pro-gradient bg-clip-text text-transparent">
                  Hall of Champs
                </span>{' '}
                Achieved!
              </h2>
              <p className="text-v1-content-secondary">
                You&apos;ve Reached the Highest Level: The Hall of Champs. Your
                Dedication and Skills Are Unmatched!
              </p>
            </>
          ) : (
            <>
              <h2 className="mb-3 text-2xl font-semibold">
                You Have Been{' '}
                <span className="text-v1-content-positive">Promoted</span>
              </h2>
              <p className="text-v1-content-secondary">
                You&apos;ve Advanced to a Higher league. Keep Up the Great Work!
              </p>
            </>
          )
        ) : profile.promotion_status === 'NEUTRAL' ? (
          <>
            <h2 className="mb-3 text-2xl font-semibold">
              You’re in Neutral Zone!
            </h2>
            <p className="mb-20 text-v1-content-secondary">
              No Rewards This Time, but You&apos;re Still in the Game! Compete
              in the League Again This Week.
            </p>
          </>
        ) : profile.promotion_status === 'DEMOTING' ? (
          <>
            <h2 className="mb-3 text-2xl font-semibold">
              You Have Been{' '}
              <span className="text-v1-content-negative">Demoted!</span>
            </h2>
            <p className="text-v1-content-secondary">
              Don&apos;t Worry, Use This as an Opportunity to Come Back
              Stronger! Keep Trading and Aim for Promotion Next Week.
            </p>
          </>
        ) : null}
        {profile.promotion_status === 'PROMOTING' && (
          <p className="mt-6">Rewards</p>
        )}
        <div className="my-4 flex items-stretch justify-center gap-3">
          {profile.result.reward_items?.map(i => (
            <div
              key={i.symbol_slug}
              className="flex flex-col rounded-lg border border-v1-border-primary/20 p-6 text-center"
              style={{
                background:
                  'linear-gradient(90deg, rgba(190, 81, 215, 0.10) 0%, rgba(45, 163, 214, 0.10) 100%)',
              }}
            >
              <div className="my-3 flex items-center gap-1">
                <img src={usdc} alt="usdt" className="size-8 w-auto" />
                <span className="text-4xl font-semibold">{i.amount}</span>
              </div>
              <hr className="mb-3 mt-auto border border-v1-border-primary/20" />
              <div>USDC</div>
            </div>
          ))}
          {profile.result.next_league_slug &&
            !isChampion &&
            profile.promotion_status !== 'NEUTRAL' && (
              <div
                className="rounded-lg border border-v1-border-primary/20 p-6 text-center"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(190, 81, 215, 0.10) 0%, rgba(45, 163, 214, 0.10) 100%)',
                }}
              >
                <LeagueIcon
                  slug={profile.result.next_league_slug}
                  className="h-20"
                />
                <hr className="mb-3 mt-1 border border-v1-border-primary/20" />
                <div className="text-xs">
                  {profile.promotion_status === 'PROMOTING'
                    ? 'Promote'
                    : 'Demote'}{' '}
                  to Next League
                </div>
              </div>
            )}
        </div>
        {(profile.result.reward_items?.length ?? 0) > 0 && (
          <p className="mt-6 text-xs text-v1-content-secondary">
            To withdraw your token, please go to rewards page and follow the
            instructions.
          </p>
        )}
      </div>
      <Button
        className="mt-3 w-full max-w-md"
        variant="white"
        loading={isPending}
        onClick={claim}
      >
        {(profile.result.reward_items?.length ?? 0) > 0 ? 'Claim' : 'Got it'}
      </Button>
    </div>
  );
}
