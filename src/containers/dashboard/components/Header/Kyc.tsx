import Tag from "components/Tag";
import { FC } from "react";
import { KYC_level_binding, VerificationStatus } from "types/kyc";
import { getKycLevelStatusColor } from "utils/utils";
import { useNavigate } from "react-router";
import { ReactComponent as LockIcon } from "@images/lock.svg";
import { useGetKycLevelsQuery } from "api/horosApi";

interface KycMenuItemProps {
  kycBinding: KYC_level_binding | undefined;
  onClick?: () => void;
}

const KycMenuItem: FC<KycMenuItemProps> = ({ kycBinding, onClick }) => {
  const navigate = useNavigate();
  const { data: kycLevels } = useGetKycLevelsQuery({});

  return (
    <>
      <button
        type="button"
        onClick={() => {
          navigate("/app/kyc");
          typeof onClick === "function" && onClick();
        }}
        className="flex items-center justify-start bg-transparent py-[10px] px-2  text-white hover:bg-gray-dark"
      >
        <LockIcon className="mr-2 w-[24px]" />
        <span className="leading-4">KYC</span>
        <div className="grow"></div>
        <Tag
          color={getKycLevelStatusColor(kycBinding?.status)}
          className="cursor-pointer text-base"
        >
          {kycBinding?.status || VerificationStatus.UNVERIFIED}
        </Tag>
      </button>
    </>
  );
};

export default KycMenuItem;
