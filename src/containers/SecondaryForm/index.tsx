import Logo from "@images/wisdomiseWealthLogo.svg";
import * as Sentry from "@sentry/react";
import { useAgreeToTermsMutation } from "api/horosApi";
import React, { useState } from "react";
import { logout } from "utils/auth";
import bgMobile from "../auth/ConfirmSignUp/bg-mobile.png";
import bgDesktop from "../auth/ConfirmSignUp/bg.png";
import PolicyDialog from "./PolicyDialog";
import TermsDialog from "./TermsDialog";

export const SecondaryForm: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isTermsOpen, setTermsOpen] = useState(false);
  const [isPolicyOpen, setPolicyOpen] = useState(false);
  const [isTermsAccepted, setTermsAccepted] = useState(false);
  const [isPolicyAccepted, setPolicyAccepted] = useState(false);
  const [errors, setErrors] = useState({
    nickname: false,
    referralCode: false,
    terms: false,
    policy: false,
  });
  const [agreeToTerms, { isLoading }] = useAgreeToTermsMutation();

  const onTermsAccepted = () => {
    setTermsAccepted(true);
    setTermsOpen(false);
    setErrors((e) => ({
      ...e,
      terms: false,
    }));
  };

  const onPolicyAccepted = () => {
    setPolicyAccepted(true);
    setPolicyOpen(false);
    setErrors((e) => ({
      ...e,
      policy: false,
    }));
  };

  const onNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setErrors((e) => ({
      ...e,
      nickname: !value,
    }));
  };

  const onSubmit = async () => {
    setErrors((e) => ({
      ...e,
      nickname: !nickname,
      terms: !isTermsAccepted,
      policy: !isPolicyAccepted,
    }));

    if (!nickname || !isTermsAccepted || !isPolicyAccepted) return;

    try {
      const data: any = {
        nickname,
        terms_and_conditions_accepted: true,
        privacy_policy_accepted: true,
      };
      if (referralCode) {
        data.referral_code = referralCode;
      }
      await agreeToTerms(data).unwrap();
      window.location.reload();
    } catch (e) {
      console.log(e);

      const errorKeys = Object.keys((e as any).data.data);
      if (errorKeys.includes("referral_code")) {
        setErrors((e) => ({
          ...e,
          referralCode: true,
        }));
        return;
      }
      Sentry.captureException(e);
    }
  };

  return (
    <div
      style={
        {
          "--bg-mobile": `url('${bgMobile}')`,
          "--bg-desktop": `url('${bgDesktop}')`,
        } as React.CSSProperties
      }
      className="min-h-screen w-full bg-[image:var(--bg-mobile)] bg-cover bg-no-repeat text-white md:bg-[image:var(--bg-desktop)]"
    >
      <div className="m-auto flex min-h-screen max-w-[1300px] flex-col justify-between">
        <div>
          <header className="mb-10 mt-8 flex items-center justify-between px-8">
            <div className="w-44">
              <img src={Logo} alt="wisdomise_wealth_logo" />
            </div>

            <button
              onClick={logout}
              className="md:text-x rounded-full border border-solid border-[#ffffff4d] px-5 py-3 text-xs md:px-8 md:py-3"
            >
              Log Out
            </button>
          </header>

          <main className="mb-20 flex flex-col items-center justify-center">
            <div className="flex flex-col items-start">
              <p className="mb-10 text-3xl md:text-4xl">
                Welcome to <br />
                <b>Wisdomise Wealth</b>
              </p>
              <Input
                error={errors.nickname && "Nickname can't be empty"}
                label="Nickname"
                placeholder="Your nickname"
                onChange={onNicknameChange}
              />
              <Input
                error={errors.referralCode && "Referrer not found"}
                label={
                  <span>
                    Invitation code{" "}
                    <span className="text-xs text-[#FFFFFF80]">(Optional)</span>
                  </span>
                }
                placeholder="Invitation code"
                onChange={(e) => setReferralCode(e.target.value)}
              />

              <Checkbox
                id="pp"
                error={
                  errors.policy &&
                  "You should accept the privacy policy before continue."
                }
                checked={isPolicyAccepted}
                onClick={() => setPolicyOpen((o) => !o)}
                label={
                  <span>
                    You are acknowledging the{" "}
                    <span className="text-[#13DEF2]">privacy policy.</span>
                  </span>
                }
              />

              <Checkbox
                id="t&c"
                error={
                  errors.terms &&
                  "You need to accept the terms in order to continue."
                }
                checked={isTermsAccepted}
                onClick={() => setTermsOpen((o) => !o)}
                label={
                  <span>
                    You are agreeing to the{" "}
                    <span className="text-[#13DEF2]">
                      terms and conditions.
                    </span>
                  </span>
                }
              />

              <button
                onClick={onSubmit}
                className="mt-5 w-full rounded-full border border-solid border-[#ffffff4d] bg-white px-9 py-3 text-base text-black md:px-16 md:py-5 md:text-xl"
              >
                Submit{isLoading ? "ing ..." : ""}
              </button>

              <TermsDialog
                isOpen={isTermsOpen}
                toggle={() => setTermsOpen((o) => !o)}
                onCheck={onTermsAccepted}
              />
              <PolicyDialog
                isOpen={isPolicyOpen}
                toggle={() => setPolicyOpen((o) => !o)}
                onCheck={onPolicyAccepted}
              />
            </div>
          </main>
        </div>

        <footer className="pb-4 text-center text-xs text-[#ffffffcc] ">
          Version Alpha 1.0.0 © 2023 Wisdomise. All rights reserved
        </footer>
      </div>
    </div>
  );
};

interface InputProps {
  placeholder: string;
  error?: string | boolean;
  label: string | React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  onChange,
  placeholder,
}) => (
  <div className="mb-5">
    <label className="pl-4 text-base">{label}</label>
    <input
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-[300px] rounded-full  border-2 border-solid border-[#ffffff1a] bg-transparent p-5 placeholder:text-[#FFFFFF80] md:w-[400px]"
    />
    {error && <p className="ml-6 text-error">{error}</p>}
  </div>
);

interface CheckboxProps {
  id: string;
  error?: string | boolean;
  checked?: boolean;
  label: string | React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onClick,
  error,
}) => (
  <div className="mb-5">
    <input checked={checked} onClick={onClick} type="checkbox" id={id} />
    <label htmlFor={id} className="pl-2">
      {label}
    </label>
    {error && <p className="ml-6 text-error">{error}</p>}
  </div>
);
