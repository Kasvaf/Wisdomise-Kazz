import { useUpdateReferrerMutation } from "api/horosApi";
import Button from "components/Button";
import Spinner from "components/common/Spinner";
import { FC, useState } from "react";
import { BUTTON_TYPE } from "utils/enums";
import Input from "../Input";

interface IReferrerSectionProps {
  onSubmit: () => void;
}

const ReferrerSection: FC<IReferrerSectionProps> = ({ onSubmit }) => {
  const [referrerCode, setReferrerCode] = useState<string>("");
  const [submitReferrerCode, { isLoading, error }] =
    useUpdateReferrerMutation();

  return (
    <>
      <div className="referral-panel flex flex-wrap items-center justify-between gap-10 p-10 px-8 py-9">
        <p className="grow-0 basis-52 text-sm font-medium text-white">
          Enter the referral code of the person who invited you
        </p>
        <form className="mr-[10%] flex max-w-[500px] gap-4 max-md:flex-wrap">
          <Input
            className="min-w-[70%] grow"
            placeholder="Enter your invitation code"
            value={referrerCode}
            onChange={(e) => setReferrerCode(e.target.value)}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            error={error?.data.message}
          />
          <Button
            type={BUTTON_TYPE.FILLED}
            className="max-h-12 min-w-[178px] px-10 text-black"
            disabled={isLoading}
            onClick={async () => {
              try {
                await submitReferrerCode(referrerCode).unwrap();
                onSubmit();
              } catch (error) {
                console.error(error);
              }
            }}
          >
            {isLoading ? <Spinner /> : "Confirm"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default ReferrerSection;
