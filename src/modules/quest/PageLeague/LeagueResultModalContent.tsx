import { useLeagueClaimMutation } from 'api/gamification';
import video from 'modules/account/PageRewards/RewardModal/images/video.webm';
import { SolanaIcon } from 'modules/autoTrader/TokenActivity';
import LeagueIcon from 'modules/quest/PageLeague/LeagueIcon';
import useLeague from 'modules/quest/PageLeague/useLeague';
import { Button } from 'shared/v1-components/Button';

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
      {profile.promotion_status === 'PROMOTING' && (
        <video
          autoPlay
          className="absolute top-0 size-full object-cover opacity-50 mix-blend-exclusion"
          muted
          playsInline
        >
          <source src={video} />
        </video>
      )}
      <div className="relative flex flex-col items-center text-center">
        <h1 className="mb-16 font-semibold text-2xl italic">
          Last Week League Result
        </h1>
        {profile.promotion_status === 'PROMOTING' ? (
          isChampion ? (
            <>
              <h2 className="mb-3 font-semibold text-2xl">
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
              <h2 className="mb-3 font-semibold text-2xl">
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
            <h2 className="mb-3 font-semibold text-2xl">
              You’re in Neutral Zone!
            </h2>
            <p className="mb-3 text-v1-content-secondary">
              No Rewards This Time, but You&apos;re Still in the Game! Compete
              in the League Again This Week.
            </p>
          </>
        ) : profile.promotion_status === 'DEMOTING' ? (
          <>
            <h2 className="mb-3 font-semibold text-2xl">
              You Have Been{' '}
              <span className="text-v1-content-negative">Demoted!</span>
            </h2>
            <p className="text-v1-content-secondary">
              Don&apos;t Worry, Use This as an Opportunity to Come Back
              Stronger! Keep Trading and Aim for Promotion Next Week.
            </p>
          </>
        ) : null}
        <hr className="mt-4 w-full border-v1-inverse-overlay-10" />
        <div className="my-2 flex w-max items-center gap-3 rounded-xl border border-v1-inverse-overlay-10 bg-v1-surface-l2 px-3 py-2 font-semibold text-sm backdrop-blur-sm">
          Your Rank: <div className="text-2xl">{profile.rank}</div>
        </div>
        <hr className="w-full border-v1-inverse-overlay-10" />
        {profile.promotion_status === 'PROMOTING' && (
          <p className="mt-6">Rewards</p>
        )}
        <div className="my-4 flex items-stretch justify-center gap-3">
          {profile.result.reward_items?.map(i => (
            <div
              className="flex flex-col rounded-lg border border-v1-border-primary/20 bg-gradient-to-b from-v1-background-brand/0 to-v1-background-brand/10 p-6 text-center"
              key={i.symbol_slug}
            >
              <div className="my-3 flex items-center gap-1">
                <SolanaIcon size="md" />
                <span className="font-semibold text-4xl">{i.amount}</span>
              </div>
              <hr className="mt-auto mb-3 border border-v1-border-primary/20" />
              <div>SOL</div>
            </div>
          ))}
          {profile.result.next_league_slug &&
            !isChampion &&
            profile.promotion_status !== 'NEUTRAL' && (
              <div className="rounded-lg border border-v1-border-primary/20 bg-gradient-to-b from-v1-background-brand/0 to-v1-background-brand/10 p-6 text-center">
                <LeagueIcon
                  className="h-20"
                  slug={profile.result.next_league_slug}
                />
                <hr className="mt-1 mb-3 border border-v1-border-primary/20" />
                <div className="text-xs">
                  {profile.promotion_status === 'PROMOTING'
                    ? 'Promoted'
                    : 'Demoted'}{' '}
                  to {profile.league?.name}
                </div>
              </div>
            )}
        </div>
        {(profile.result.reward_items?.length ?? 0) > 0 && (
          <p className="mt-6 text-v1-content-secondary text-xs">
            To withdraw your token, please go to rewards page and follow the
            instructions.
          </p>
        )}
      </div>
      <Button
        className="mt-3 w-full max-w-md"
        loading={isPending}
        onClick={claim}
        variant="primary"
      >
        {(profile.result.reward_items?.length ?? 0) > 0 ? 'Claim' : 'Got it'}
      </Button>
    </div>
  );
}
