import { FunctionComponent } from "react";
import { useGetUserInfoQuery } from "api/horosApi";

interface props {
  signOut: () => void;
}
const ConfirmSignUp: FunctionComponent<props> = ({ signOut }) => {
  const { data: userInfo } = useGetUserInfoQuery({});

  const userName = userInfo?.customer.user.email || "";
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
      <button
        className="mt-3 h-12 p-0"
        onClick={() => window.location.reload()}
      >
        Check
      </button>
      <button className="horos-btn-secondary mt-3 h-12 p-0" onClick={signOut}>
        Logout
      </button>
    </div>
  );
};

export default ConfirmSignUp;
