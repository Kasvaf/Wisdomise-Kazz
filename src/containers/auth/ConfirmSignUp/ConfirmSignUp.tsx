import { FunctionComponent } from "react";
import { useGetUserInfoQuery } from "api/horosApi";
import Button from "components/Button";
import { BUTTON_TYPE } from "utils/enums";

interface props {
  signOut: () => void;
}

const ConfirmSignUp: FunctionComponent<props> = ({ signOut }) => {
  const { data: userInfo } = useGetUserInfoQuery({});

  const userName = userInfo?.customer.user.email || "";

  return (
    <div className="m-auto flex h-full w-[27rem] flex-col justify-center  p-5">
      <p className="mb-2 text-xl text-white">Verify your email</p>
      <p className="mb-4 text-nodata">
        A link has been sent to your email ({userName}). To verify your account,
        please click on the link.
      </p>
      <Button
        type={BUTTON_TYPE.FILLED}
        className="mt-3 h-12 w-full p-0"
        onClick={() => window.location.reload()}
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
