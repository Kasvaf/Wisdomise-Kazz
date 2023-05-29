import React, { FunctionComponent, useEffect, useState } from "react";
import DB from "config/keys";
import {
  useGetUserInfoQuery,
  useResendVerificationEmailMutation,
} from "api/horosApi";
import Logo from "@images/wisdomiseWealthLogo.svg";
import bgDesktop from "./bg.png";
import bgMobile from "./bg-mobile.png";
import inboxImg from "./email.svg";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { NotificationManager } from "react-notifications";
import { WISDOMISE_TOKEN_KEY } from "config/constants";

interface props {
  signOut: () => void;
}

const ConfirmSignUp: FunctionComponent<props> = ({ signOut }) => {
  const { data: userInfo } = useGetUserInfoQuery({});
  const [isChecking, setIsChecking] = useState(false);
  const [resend, { isLoading, status }] = useResendVerificationEmailMutation();

  const checkAgain = () => {
    setIsChecking(true);
    localStorage.removeItem(WISDOMISE_TOKEN_KEY);
    window.location.assign(`${DB}/api/v1/account/login`);
  };

  useEffect(() => {
    if (status === QueryStatus.fulfilled) {
      NotificationManager.success("Verification Email Sent Successfully.");
    }
  }, [status]);

  return (
    <div
      style={
        {
          "--bg-mobile": `url('${bgMobile}')`,
          "--bg-desktop": `url('${bgDesktop}')`,
        } as React.CSSProperties
      }
      className="h-screen w-full bg-[image:var(--bg-mobile)] bg-[length:100%_100vh] bg-no-repeat text-white md:bg-[image:var(--bg-desktop)]"
    >
      <div className="m-auto flex min-h-screen max-w-[1300px] flex-col justify-between">
        <header className="mt-8 flex items-center justify-between px-8">
          <div className="w-44">
            <img src={Logo} alt="wisdomise_wealth_logo" />
          </div>

          <button
            onClick={signOut}
            className="md:text-x rounded-full border border-solid border-[#ffffff4d] py-3 px-5 text-xs md:px-8 md:py-3"
          >
            Log Out
          </button>
        </header>

        <main className="flex flex-col items-center justify-center">
          <img src={inboxImg} className="w-32 md:w-44" alt="inbox" />
          <p className="text-3xl text-white md:text-5xl">
            Verify <b>Your Email</b>
          </p>

          <p className="p-7 text-center text-sm leading-loose text-[#ffffffcc]">
            A link has been sent to your email{" "}
            <span className="text-[#ffffff]">
              {userInfo?.customer.user.email || ""}
            </span>
            <br />
            To verify your account, please click on the link.
          </p>

          <button
            onClick={checkAgain}
            className="mb-4 rounded-full border border-solid border-[#ffffff4d] py-3 px-9 text-base md:px-16 md:py-5 md:text-xl"
          >
            Check{isChecking ? "ing..." : ""}
          </button>

          <button
            className="rounded-full border border-solid border-[#ffffff4d] py-3 px-9 text-base md:px-16 md:py-5 md:text-xl"
            onClick={resend}
          >
            {isLoading
              ? "Resending Verification Email ..."
              : "Resend Verification Email"}
          </button>
        </main>

        <footer className="pb-4 text-center text-xs text-[#ffffffcc] ">
          Version alpha 1.0.0 © 2023 Wisdomise. All rights reserved
        </footer>
      </div>
    </div>
  );
};

export default ConfirmSignUp;
