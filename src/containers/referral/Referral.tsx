import IntroSection from "containers/dashboard/components/Referral/IntroSection.tsx";
import ReferralLevel from "containers/dashboard/components/Referral/ReferralLevel";
import ReferrerSection from "containers/dashboard/components/Referral/ReferrerSection";
import { useGetReferralLevelsQuery, useGetUserInfoQuery } from "api/horosApi";
import {
  IReferralLevel,
  IReferralLevelBinding,
} from "containers/dashboard/components/Referral/ReferralLevel/types";
import Spinner from "components/spinner";
import { useEffect, useState } from "react";
import LevelUpModal from "containers/dashboard/components/Referral/modals/LevelUpModal";
import ReferrerSuccessModal from "containers/dashboard/components/Referral/modals/ReferrerSuccessModal";
import { REFERRAL_LEVELS } from "config/constants";
import ReferrerCounter from "containers/dashboard/components/Referral/ReferrerCounter";

interface ILocalLevels {
  [key: string]: {
    level: number;
  };
}

const ReferralPage: React.FC = () => {
  const { data: userInfo } = useGetUserInfoQuery({});
  const { data: referralLevels, isLoading } = useGetReferralLevelsQuery({});
  const [levelupModalOpen, setLevelupModalOpen] = useState<boolean>(false);
  const [currentLevel, setCurrentLevel] =
    useState<IReferralLevelBinding | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const storedLevels = window.localStorage.getItem(REFERRAL_LEVELS);
    let storedLevelsParsed: ILocalLevels = {};

    try {
      if (storedLevels) storedLevelsParsed = JSON.parse(storedLevels);
    } catch (error) {
      console.error("Error parsing JSON", error);
    }

    if (userInfo) {
      const currentHighestLevel = userInfo.customer.referral_level_bindings
        .length
        ? userInfo.customer.referral_level_bindings.sort(
            (a: IReferralLevelBinding, b: IReferralLevelBinding) =>
              b.referral_level.level - a.referral_level.level
          )[0]
        : null;

      const storedCustomerAccountLevel =
        storedLevelsParsed[userInfo.customer.user.email]?.level;

      if (!Number.isInteger(storedCustomerAccountLevel)) {
        if (currentHighestLevel) {
          window.localStorage.setItem(
            REFERRAL_LEVELS,
            JSON.stringify({
              [userInfo.customer.user.email]: {
                level: currentHighestLevel.referral_level.level,
              },
            })
          );
          setLevelupModalOpen(true);
        }
      } else {
        if (currentHighestLevel)
          if (
            +storedCustomerAccountLevel <
            currentHighestLevel.referral_level.level
          ) {
            window.localStorage.setItem(
              REFERRAL_LEVELS,
              JSON.stringify({
                [userInfo.customer.user.email]: {
                  level: currentHighestLevel.referral_level.level,
                },
              })
            );
            setLevelupModalOpen(true);
          }
      }
      setCurrentLevel(currentHighestLevel);
    }
  }, [userInfo]);

  return (
    <>
      {/* Modals */}
      {levelupModalOpen && currentLevel && (
        <LevelUpModal
          level={currentLevel.referral_level.level}
          message={`As you referred your friend, we have given you ${
            currentLevel.referral_level.bonuses[0].subscription_bonus
              .duration_days
          } days extra free subscription on ${currentLevel.referral_level.bonuses[0].subscription_bonus.subscription_plan.title.toLowerCase()} plan for your first refer!`}
          onOk={() => {
            setLevelupModalOpen(false);
          }}
        />
      )}
      {showModal && <ReferrerSuccessModal onOk={() => setShowModal(false)} />}

      <div className="mt-9 flex flex-col gap-9 font-inter">
        <IntroSection
          isLoading={isLoading}
          referralCode={userInfo?.customer.referral_code}
          referredUsers={userInfo?.customer.referees_count}
          activeReferredUsers={userInfo?.customer.active_referees_count}
        />

        {isLoading || !userInfo ? (
          <div className="grid w-full place-items-center">
            <Spinner />
          </div>
        ) : (
          <>
            {userInfo.customer.referrer === null && (
              <ReferrerSection onSubmit={() => setShowModal(true)} />
            )}
            <ReferrerCounter
              activeReferredUsers={userInfo.customer.active_referees_count}
              totalReferredUsers={userInfo.customer.referees_count}
            />
            <div className="flex gap-5 max-sm:flex-wrap">
              {referralLevels.results.map((level: IReferralLevel) => {
                return (
                  <ReferralLevel
                    referredUsers={userInfo?.customer.referees_count}
                    activeReferredUsers={
                      userInfo?.customer.active_referees_count
                    }
                    levelBindings={userInfo?.customer.referral_level_bindings}
                    key={level.description}
                    data={level}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
      {/*
					TODO: this is here so we could later on use the paths inside of the defs, it may be a good idea to move the paths out of here
					and put it inside CSS straight away.
			*/}
      <div className="h-0 w-0">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="rl-circle">
              <circle opacity="0.5" cx="18" cy="18" r="18" />
            </clipPath>
          </defs>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="rl-hexagon">
              <path
                opacity="0.5"
                d="M17.8146 0.0966797L35.1352 10.0967V30.0967L17.8146 40.0967L0.494141 30.0967V10.0967L17.8146 0.0966797Z"
              />
            </clipPath>
          </defs>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="rl-diamond">
              <path
                opacity="0.5"
                d="M42 21.418L21 42.418L0 21.418L21 0.417969L42 21.418Z"
              />
            </clipPath>
          </defs>
        </svg>
      </div>
    </>
  );
};

export default ReferralPage;
