import { useRef, useState } from "react";
import { ReactComponent as CloseIcon } from "@images/close.svg";
import { ReactComponent as WaitListJoinIcon } from "@images/waitListJoin.svg";
import { ReactComponent as WaitListSuccessIcon } from "@images/WaitListSuccess.svg";
import { ReactComponent as WaitListFailedIcon } from "@images/WaitListFailed.svg";
import { useSetWaitingListMutation } from "api/horosApi";
import Button from "components/Button";
import { BUTTON_TYPE } from "utils/enums";

enum CONFIRMATION_STATUS {
  SUCCESS,
  FAILED,
}

const RegistrationSuccessful = (props: any) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <WaitListSuccessIcon className="mb-10" />
      <h1 className="text-3xl text-white">Registration Successful!</h1>
      <p className="my-[50px]  text-base text-gray-light">
        <ul className="list-disc">
          <li>You are now added to our invite-only waitlist</li>
          <li>2-months free subscription will be activated automatically</li>
        </ul>
      </p>
      <div className="flex flex-row gap-5">
        <Button
          text="done"
          className="!w-full"
          type={BUTTON_TYPE.FILLED}
          onClick={props.onClick}
        />
      </div>
    </div>
  );
};

const RegistrationFailed = (props: any) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <WaitListFailedIcon className="mb-10" />
      <h1 className="text-3xl text-white">Failed registration!</h1>
      <p className="my-[50px] text-center text-base text-gray-light">
        Entered code is not correct. Please double check the code or contact our
        support via chat or email at support@wisdomise.io
      </p>
      <div className="flex flex-row gap-5">
        <Button
          text="Try Again"
          type={BUTTON_TYPE.FILLED}
          onClick={props.onClick}
        />
      </div>
    </div>
  );
};

// const AlreadyJoined = (props: any) => {
//   return (
//     <div className="flex flex-col items-center justify-center">
//       <WaitListAlreadyJoinedIcon className="mb-10" />
//       <h1 className="text-3xl text-white">You already joined!</h1>
//       <p className="my-[50px] text-center text-base text-gray-light">
//         You have already been added to our waitlist, wait a little until this
//         package becomes available for you
//       </p>
//       <div className="flex flex-row gap-5">
//         <Button text="Done" type={BUTTON_TYPE.FILLED} onClick={props.onClick} />
//       </div>
//     </div>
//   );
// };

const GiftCodeBox = (props: any) => {
  const [confirmationStatus, setConfirmationStatus] =
    useState<CONFIRMATION_STATUS | null>(null);
  const invitationCodeRef = useRef(null);

  const [setWaitingList, waitingList] = useSetWaitingListMutation();

  const onClose = () => {
    if (typeof props.onClose === "function") props.onClose();
  };

  const onConfirm = async () => {
    const input: any = invitationCodeRef.current;
    const data = {
      etf_package_key: props.packageKey,
      invitation_code: input?.value.trim(),
    };

    const result: any = await setWaitingList(data);
    if (result.error) return setConfirmationStatus(CONFIRMATION_STATUS.FAILED);
    setConfirmationStatus(CONFIRMATION_STATUS.SUCCESS);
  };

  return (
    <div className="px-[45px] py-[56px]">
      <div className=" flex w-full justify-end px-2">
        <CloseIcon className="cursor-pointer fill-white" onClick={onClose} />
      </div>
      {confirmationStatus === CONFIRMATION_STATUS.SUCCESS ? (
        <RegistrationSuccessful
          onClick={() => {
            onClose();
            props.onDone();
          }}
        />
      ) : confirmationStatus === CONFIRMATION_STATUS.FAILED ? (
        <RegistrationFailed
          onClick={() => {
            setConfirmationStatus(null);
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <WaitListJoinIcon className="mb-10" />
          <h1 className="text-3xl text-white">Join our Invite-only waitlist</h1>
          <p className="my-[50px] text-center text-base text-gray-light">
            Wisdomise AI is currently in invite-only mode. Put your invitation
            code below and we will come back to you as soon as possible.
          </p>
          <div className="flex flex-row flex-wrap gap-5">
            <input
              type="text"
              ref={invitationCodeRef}
              placeholder="Enter your invitation code"
              className="h-[52px] min-w-[300px] rounded-sm bg-gray-main pl-4 text-white"
            />
            <Button
              text={waitingList.isLoading ? "loading ..." : "confirm"}
              type={BUTTON_TYPE.FILLED}
              onClick={onConfirm}
              disabled={waitingList.isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftCodeBox;
