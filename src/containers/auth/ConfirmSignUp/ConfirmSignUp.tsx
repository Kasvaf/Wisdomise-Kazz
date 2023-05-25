import { FunctionComponent, useCallback } from "react";
import DB from "config/keys";
import { useGetUserInfoQuery } from "api/horosApi";
import Button from "components/Button";
import { BUTTON_TYPE } from "utils/enums";
import { WISDOMISE_TOKEN_KEY } from "config/constants";

interface props {
  signOut: () => void;
}
const ConfirmSignUp: FunctionComponent<props> = ({ signOut }) => {
  const { data: userInfo } = useGetUserInfoQuery({});

  const userName = userInfo?.customer.user.email || "";

  const checkAgain = useCallback(() => {
    localStorage.removeItem(WISDOMISE_TOKEN_KEY);
    window.location.assign(`${DB}/api/v1/account/login`);
  }, []);

  return (
    <div
      className="m-auto flex w-[27rem] flex-col p-5"
      style={{ marginTop: "50vh", transform: "translateY(-50%)" }}
    >
      <p className="mb-2 text-xl text-white">Verify your email</p>
      <p className="mb-4 text-nodata">
        A link has been sent to your email ({userName}). To verify your account,
        please click on the link.
      </p>
      <Button
        type={BUTTON_TYPE.FILLED}
        className="mt-3 h-12 w-full p-0"
        onClick={checkAgain}
      >
        Check
      </Button>
      <button
        className="horos-btn-secondary mt-3 h-12 p-0 font-bold"
        onClick={signOut}
      >
        Logout
      </button>
    </div>
  );
};

export default ConfirmSignUp;
