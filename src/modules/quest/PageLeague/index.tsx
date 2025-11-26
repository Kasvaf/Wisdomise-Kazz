import { clsx } from 'clsx';
import PageWrapper from 'modules/base/PageWrapper';
import LeagueIcon from 'modules/quest/PageLeague/LeagueIcon';
import LeagueResultModalContent from 'modules/quest/PageLeague/LeagueResultModalContent';
import useLeague from 'modules/quest/PageLeague/useLeague';
import Leaderboard, {
  LeaderboardItem,
} from 'modules/quest/PageTournaments/PageTournamentDetail/Leaderboard';
import {
  CountdownBar,
  LeaderboardPrizes,
} from 'modules/quest/PageTournaments/TournamentCard';
import { useEffect, useState } from 'react';
import {
  type LeagueDetail,
  useLeagueLeaderboardQuery,
  useLeagueProfileQuery,
} from 'services/rest/gamification';
import Badge from 'shared/Badge';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import { PageTitle } from 'shared/PageTitle';
import useModal from 'shared/useModal';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import useIsMobile from 'utils/useIsMobile';
import { ReactComponent as Champion } from '../PageTournaments/PageTournamentDetail/Leaderboard/champion.svg';
import { ReactComponent as Promoting } from '../PageTournaments/PageTournamentDetail/Leaderboard/promoting.svg';
import cup from './images/cup.png';
import prize from './images/prize.png';
// eslint-disable-next-line import/no-unassigned-import
import 'swiper/css/navigation';
import { DOCS_ORIGIN } from 'config/constants';

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
      extension={!isMobile && <CoinExtensionsGroup />}
      loading={isLoading}
    >
      <PageTitle
        className="mb-3"
        description="Compete Weekly, Earn Points, and Climb the Ranks. Stay Competitive and Aim for the Top!"
        title="Compete, Rise, and Conquer!"
      />
      <a
        className="!text-v1-content-link text-sm"
        href={`${DOCS_ORIGIN}/Perks-Rewards-2b1c705b061580b6a6ffe0fc73fc8782`}
        target="_blank"
      >
        How it Works?
      </a>

      <div className="mx-auto my-8 h-48">
        {selectedLeagueIndex === undefined ? null : (
          <Swiper
            centeredSlides
            className={clsx(
              '[&_.swiper-button-next]:!mr-[35vw] [&_.swiper-button-next]:!text-v1-content-primary [&_.swiper-button-next]:mobile:!mr-[15vw] [&_.swiper-button-next]:scale-50',
              '[&_.swiper-button-prev]:!ml-[35vw] [&_.swiper-button-prev]:!text-v1-content-primary [&_.swiper-button-prev]:mobile:!ml-[15vw] [&_.swiper-button-prev]:scale-50',
            )}
            initialSlide={selectedLeagueIndex}
            modules={[Navigation]}
            navigation
            onActiveIndexChange={s => setSelectedLeagueIndex(s.activeIndex)}
            slidesPerView={isMobile ? 2 : 4}
            spaceBetween={15}
          >
            {league.details?.map((item, index) => {
              const isActive = selectedLeagueIndex === index;
              return (
                <SwiperSlide key={item.slug}>
                  <div className="relative mx-auto flex flex-col items-center">
                    {profile.league_slug === item.slug && (
                      <Badge
                        className="absolute top-0"
                        color="orange"
                        label="You Are Here"
                      />
                    )}
                    <LeagueIcon
                      className={clsx(
                        'mt-2 transition-all',
                        isActive ? 'size-40' : 'size-32 opacity-50',
                      )}
                      isActive={isActive}
                      slug={item.slug}
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
      <div className="grid grid-cols-2 mobile:grid-cols-1 items-start gap-x-4 gap-y-8">
        <div>
          {selectedLeague && league.end_time && league.start_time && (
            <Prize
              endTime={league.end_time}
              league={selectedLeague}
              rewardedUsersMinRank={rewardedUsersMinRank}
              startTime={league.start_time}
            />
          )}
          {me && me.league_slug === selectedLeague?.slug && (
            <div className="mt-3 mobile:hidden rounded-xl bg-v1-surface-l1 p-3">
              <h2 className="mb-2">My Status</h2>
              <LeaderboardItem
                isTopLevel={selectedLeague?.level === 2}
                participant={me}
              />
            </div>
          )}
        </div>
        <Leaderboard
          isTopLevel={selectedLeague?.level === 2}
          me={me?.league_slug === selectedLeague?.slug ? me : undefined}
          participants={participants}
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
        alt="prize"
        className={clsx('-top-8 absolute right-0 h-40', isTopLevel && 'h-44')}
        src={isTopLevel ? cup : prize}
      />
      <div className="mb-1 flex items-center gap-2">
        <h2 className="font-semibold">Weekly Prize</h2>
        <div className="rounded-md bg-v1-overlay-40 px-1 text-xxs">
          Top {rewardedUsersMinRank}
        </div>
      </div>
      <p className="mb-3 text-v1-inverse-overlay-70 text-xs">
        Keep Trading to Stay in the Top {rewardedUsersMinRank}!
      </p>
      <div className="flex max-w-[70%] flex-wrap items-center gap-2">
        <div className="flex w-max items-center gap-1 rounded-lg bg-white/5 p-1">
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
        <div className="flex w-max rounded-lg bg-white/5 p-1">
          <LeaderboardPrizes
            description={league.description}
            hasDetail={true}
            prizes={league.prizes}
          />
        </div>
      </div>
      <hr className="my-3 border-white/5" />
      <CountdownBar endDate={endTime} startDate={startTime} />
    </div>
  );
}
