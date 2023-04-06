import KYCLevelCard from "containers/dashboard/components/KYCLevelCard";
import { KYC_Level } from "types/kyc";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetKycLevelsQuery, useGetUserInfoQuery } from "api/horosApi";

const KycPage: React.FC = () => {
  const navigate = useNavigate();
  const [levelsFormatted, setLevelsFormatted] = useState<{
    [key: string]: KYC_Level;
  }>({});
  const { data: levels, isLoading } = useGetKycLevelsQuery({});
  const { data: userInfo, isLoading: isFetchingUserInfo } = useGetUserInfoQuery(
    {}
  );

  useEffect(() => {
    if (!isLoading && levels) {
      const result: { [key: string]: KYC_Level } = {};
      levels.results.forEach((lvl: KYC_Level) => {
        result[lvl.name] = lvl;
      });

      setLevelsFormatted(result);
    }
  }, [isLoading, levels]);

  return (
    <>
      <div className="mt-2">
        <h2 className="mb-4 font-campton text-base text-white xl:text-xl">
          Verification
        </h2>
        <p className="mb-6 font-campton text-base text-gray-light ">
          By verifying your identity, you can rest assured that your personal
          and financial information is protected from fraud and misuse.
          Completing KYC also allows you access to more features and services
        </p>

        <div className="my-10">
          <h6 className="text-2xl text-white">Why is it necessary?</h6>
          <p className="my-4 text-base text-gray-light ">
            There are several reasons why you should carry out KYC, including:
          </p>
          <ul className="list-disc pl-8 text-base leading-8 text-gray-light">
            <li>
              <span className="font-medium text-white">Security:</span> KYC
              helps to protect your personal and financial information from
              fraud and misuse.
            </li>
            <li>
              <span className="font-medium text-white">Compliance:</span> It
              helps to ensure compliance with legal and regulatory requirements,
              including anti-money laundering laws.
            </li>
            <li>
              <span className="font-medium text-white">Access:</span> Completing
              KYC allows you to access more features and services offered by the
              platform.
            </li>
            <li>
              <span className="font-medium text-white">Trust:</span> It helps to
              build trust between you and the platform, ensuring that you are
              who you say you are and that the platform can be sure of its
              customers.
            </li>
            <li>
              <span className="font-medium text-white">Convenience:</span> It
              allows for seamless transactions, faster processing and easy
              access to services.
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 text-white md:grid-cols-3">
        {Object.entries(levelsFormatted).map(([title, data]) => {
          const status =
            userInfo?.kyc_level_bindings.filter(
              (lvlBind) => lvlBind.kyc_level.name === data.name
            )[0] || null;

          return (
            <KYCLevelCard
              benefits={data.benefits}
              requirements={data.requirements}
              key={title}
              title={title}
              status={status?.status}
              isLoading={isFetchingUserInfo}
              onVerify={() => {
                navigate("/app/kyc/verification?level=" + title);
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default KycPage;
