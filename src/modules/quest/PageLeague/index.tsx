import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import {
  type LeagueDetail,
  useLeagueLeaderboardQuery,
  useLeagueProfileQuery,
} from 'api/gamification';
import Badge from 'shared/Badge';
import Leaderboard, {
  LeaderboardItem,
} from 'modules/quest/PageTournaments/PageTournamentDetail/Leaderboard';
import LeagueIcon from 'modules/quest/PageLeague/LeagueIcon';
import useLeague from 'modules/quest/PageLeague/useLeague';
import {
  CountdownBar,
  LeaderboardPrizes,
} from 'modules/quest/PageTournaments/TournamentCard';
import useIsMobile from 'utils/useIsMobile';
import LeagueResultModalContent from 'modules/quest/PageLeague/LeagueResultModalContent';
import useModal from 'shared/useModal';
import { ReactComponent as Promoting } from '../PageTournaments/PageTournamentDetail/Leaderboard/promoting.svg';
import { ReactComponent as Champion } from '../PageTournaments/PageTournamentDetail/Leaderboard/champion.svg';
import prize from './images/prize.png';
import cup from './images/cup.png';
// eslint-disable-next-line import/no-unassigned-import,import/max-dependencies
import 'swiper/css/navigation';

export default function PageLeague() {
  const { profile, league, isLoading } = useLeague();
  const isMobile = useIsMobile();
  const [selectedLeagueIndex, setSelectedLeagueIndex] = useState<
    number | undefined
  >();
  const { data: me } = useLeagueProfileQuery();
  const { data: participants } = useLeagueLeaderboardQuery(
    selectedLeagueIndex === undefined
      ? undefined
      : league.details?.[selectedLeagueIndex].slug,
  );
  const [leagueResultModal, openLeagueResultModal] = useModal(
    LeagueResultModalContent,
    {
      closable: false,
      maskClosable: false,
      mobileDrawer: true,
      className:
        '[&>.ant-drawer-wrapper-body]:!bg-v1-surface-l1 [&>.ant-modal-content]:!bg-v1-surface-l1',
    },
  );

  const selectedLeague = league.details?.[selectedLeagueIndex ?? 0];
  const rewardedUsersMinRank = selectedLeague?.prizes.reduce(
    (min, p) => Math.max(min, p.end_rank),
    0,
  );

  useEffect(() => {
    if (profile.result.next_league_slug) {
      void openLeagueResultModal({});
    }
  }, [openLeagueResultModal, profile.result]);

  useEffect(() => {
    if (profile.league && selectedLeagueIndex === undefined) {
      setSelectedLeagueIndex(
        league.details?.findIndex(l => l.level === profile.league?.level),
      );
    }
  }, [selectedLeagueIndex, profile.league, league.details]);

  return (
    <PageWrapper
      hasBack={true}
      footer={null}
      title="League"
      loading={isLoading}
    >
      <PageTitle
        className="pt-8"
        title="Compete, Rise, and Conquer!"
        description="Compete Weekly, Earn Points, and Climb the Ranks. Stay Competitive and Aim for the Top!"
      />

      <div className="mx-auto my-8 h-48">
        {selectedLeagueIndex === undefined ? null : (
          <Swiper
            initialSlide={selectedLeagueIndex}
            navigation
            slidesPerView={isMobile ? 2 : 4}
            spaceBetween={15}
            centeredSlides
            modules={[Navigation]}
            onActiveIndexChange={s => setSelectedLeagueIndex(s.activeIndex)}
            className={clsx(
              '[&_.swiper-button-next]:!mr-[35vw] [&_.swiper-button-next]:scale-50 [&_.swiper-button-next]:!text-v1-content-primary [&_.swiper-button-next]:mobile:!mr-[15vw]',
              '[&_.swiper-button-prev]:!ml-[35vw] [&_.swiper-button-prev]:scale-50 [&_.swiper-button-prev]:!text-v1-content-primary [&_.swiper-button-prev]:mobile:!ml-[15vw]',
            )}
          >
            {league.details?.map((item, index) => {
              const isActive = selectedLeagueIndex === index;
              return (
                <SwiperSlide key={item.slug}>
                  <div className="relative mx-auto flex flex-col items-center">
                    {profile.league_slug === item.slug && (
                      <Badge
                        label="You Are Here"
                        color="orange"
                        className="absolute top-0"
                      />
                    )}
                    <LeagueIcon
                      className={clsx(
                        'mt-2 transition-all',
                        isActive ? 'size-40' : 'size-32 opacity-50',
                      )}
                      slug={item.slug}
                      isActive={isActive}
                    />
                    <h2
                      className={clsx(
                        'mb-4 font-semibold',
                        !isActive && 'opacity-50',
                      )}
                      style={{
                        textShadow:
                          '0px 1.264px 25.11px rgba(255, 255, 255, 0.25), 0px 1.264px 21.09px rgba(203, 218, 230, 0.50)',
                      }}
                    >
                      {item.name}
                    </h2>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
      <div className="grid grid-cols-2 items-start gap-x-4 gap-y-8 mobile:grid-cols-1">
        <div>
          {selectedLeague && league.end_time && league.start_time && (
            <Prize
              league={selectedLeague}
              startTime={league.start_time}
              endTime={league.end_time}
              rewardedUsersMinRank={rewardedUsersMinRank}
            />
          )}
          {me && me.league_slug === selectedLeague?.slug && (
            <div className="mt-3 rounded-xl bg-v1-surface-l2 p-3 mobile:hidden">
              <h2 className="mb-2">My Status</h2>
              <LeaderboardItem
                participant={me}
                isTopLevel={selectedLeague?.level === 2}
              />
            </div>
          )}
        </div>
        <Leaderboard
          participants={participants}
          me={me?.league_slug === selectedLeague?.slug ? me : undefined}
          isTopLevel={selectedLeague?.level === 2}
          rewardedUsersMinRank={rewardedUsersMinRank}
        />
      </div>
      {leagueResultModal}
    </PageWrapper>
  );
}

function Prize({
  league,
  startTime,
  endTime,
  rewardedUsersMinRank,
}: {
  league: LeagueDetail & { description: string; image: string };
  startTime: string;
  endTime: string;
  rewardedUsersMinRank?: number;
}) {
  const isTopLevel = league.level === 2;

  return (
    <div
      className="relative rounded-xl p-3 text-sm"
      style={{
        background: isTopLevel
          ? 'linear-gradient(126deg, #625134 -2.76%, #F7D57E 100%)'
          : 'linear-gradient(126deg, #345262 -2.76%, #7ECBF7 100%)',
      }}
    >
      <img
        src={isTopLevel ? cup : prize}
        alt="prize"
        className={clsx('absolute -top-8 right-0 h-40', isTopLevel && 'h-44')}
      />
      <div className="mb-1 flex items-center gap-2">
        <h2 className="font-semibold">Weekly Prize</h2>
        <div className="rounded-md  bg-v1-overlay-40 px-1 text-xxs">
          Top {rewardedUsersMinRank}
        </div>
      </div>
      <p className="mb-3 text-xs text-v1-inverse-overlay-70">
        Keep Trading to Stay in the Top {rewardedUsersMinRank}!
      </p>
      <div className="flex w-max rounded-lg bg-white/5 p-1">
        <LeaderboardPrizes
          prizes={league.prizes}
          hasDetail={true}
          description={league.description}
        />
      </div>
      <div className="mt-2 flex w-max items-center gap-1 rounded-lg bg-white/5 p-1">
        {isTopLevel ? (
          <>
            <Champion className="size-4" />
            Stays in Current League
          </>
        ) : (
          <>
            <Promoting className="size-4" />
            Promote to Next League
          </>
        )}
      </div>
      <hr className="my-3 border-white/5" />
      <CountdownBar startDate={startTime} endDate={endTime} />
    </div>
  );
}
