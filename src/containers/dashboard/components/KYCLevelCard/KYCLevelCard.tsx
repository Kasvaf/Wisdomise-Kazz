import successImage from "@images/success-check.png";
import { ReactComponent as TickIcon } from "@images/tick.svg";
import Button from "components/Button";
import Spinner from "components/common/Spinner";
import Tag from "components/Tag";
import React, { FC } from "react";
import { VerificationCardProps, VerificationStatus } from "types/kyc";
import { BUTTON_TYPE } from "utils/enums";
import { getKycLevelStatusColor, isPendingOrRejected } from "utils/utils";

const VerificationLevelCard: FC<VerificationCardProps> = ({
  title,
  status,
  benefits,
  onVerify,
  isLoading,
  requirements,
}) => {
  if (isLoading) return <Spinner />;

  return (
    <div className="dashboard-panel p-0">
      <div className={"flex items-center justify-between gap-4 p-8"}>
        <h2 className="text-4xl text-white">{title}</h2>
        {status === VerificationStatus.VERIFIED && (
          <img
            className="aspect-square w-[50px]"
            src={successImage}
            alt="Invitation Successful"
          />
        )}
      </div>
      <div className="mx-auto mb-6 w-[calc(100%-4rem)] border-b-[1px] border-gray-main" />
      <div className="flex flex-1 flex-col p-8 pt-0">
        <div className="mb-4 border-l-4 border-primary pl-2 text-sm">
          Benefits
        </div>
        <div className="grid grid-cols-2 gap-y-6">
          {benefits.map((b) => (
            <div key={b.title} className="flex flex-col gap-2">
              <div className="text-lg text-white/50">{b.title}</div>
              {Array.isArray(b.description) ? (
                b.description.map((v) => (
                  <div key={v} className="text-lg text-white">
                    {v}
                  </div>
                ))
              ) : (
                <div className="text-lg text-white">{b.description}</div>
              )}
            </div>
          ))}
        </div>
        <div className="mb-4 mt-8 border-l-4 border-primary pl-2 text-sm">
          Requirements
        </div>
        <div className="flex items-center gap-6">
          {requirements.map((r, i) => (
            <React.Fragment key={r.title}>
              <div className="flex items-center justify-center gap-2">
                <TickIcon className="w-4" />
                <span>{r.title}</span>
              </div>
              {i < requirements.length - 1 && (
                <div className="h-[20px] w-[1px] bg-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex-1" />
        <div className="mt-6 flex items-center justify-between">
          {/*
           * 	KYC level card button and status visibility criteria:
           * 	https://app.clickup.com/t/860q3myqg?block=block-fc7b1579-0a62-4216-a657-a60798969370
           *
           */}
          {!isPendingOrRejected(status) &&
            status !== VerificationStatus.VERIFIED && (
              <Button
                onClick={onVerify}
                type={BUTTON_TYPE.FILLED}
                text={"Verify Now"}
              />
            )}
          {!isPendingOrRejected(status) && status && (
            <Tag color={getKycLevelStatusColor(status)}>{status}</Tag>
          )}
          {isPendingOrRejected(status) && (
            <Tag color={getKycLevelStatusColor(status)}>{status}</Tag>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationLevelCard;
