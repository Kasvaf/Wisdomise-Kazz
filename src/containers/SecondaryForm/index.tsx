import { useAgreeToTermsMutation } from "api/horosApi";
import Button from "components/Button";
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from "react";
import { BUTTON_TYPE } from "utils/enums";
import PolicyDialog from "./PolicyDialog";
import * as Sentry from "@sentry/react";
import TermsDialog from "./TermsDialog";
import styles from "./styles.module.scss";

export default function SecondaryForm() {
  const [isTermsOpen, setTermsOpen] = useState(false);
  const [isTermsAccepted, setTermsAccepted] = useState(false);
  const [isTermsErrorVisible, setTermsErrorVisible] = useState(false);
  const [isPolicyOpen, setPolicyOpen] = useState(false);
  const [isPolicyAccepted, setPolicyAccepted] = useState(false);
  const [isPolicyErrorVisible, setPolicyErrorVisible] = useState(false);
  const [nickname, setNickname] = useState("");
  const [nicknameErrorVisible, setNicknameErrorVisible] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [hasInvalidReferralCodeError, setInvalidReferralCodeError] =
    useState<string>("");

  const [agreeToTerms, { isLoading }] = useAgreeToTermsMutation();

  const toggleTerms = useCallback((event?: MouseEvent) => {
    event?.preventDefault();
    setTermsOpen((p) => !p);
  }, []);
  const togglePolicy = useCallback((event?: MouseEvent) => {
    event?.preventDefault();
    setPolicyOpen((p) => !p);
  }, []);

  const onTermsChecked = useCallback(
    (event: any) => {
      if (!event.target.checked) {
        setTermsAccepted(false);
        return;
      }

      if (!isTermsAccepted) {
        toggleTerms();
      }
    },
    [isTermsAccepted, toggleTerms]
  );
  const onPolicyChecked = useCallback(
    (event: any) => {
      if (!event.target.checked) return;

      if (!isPolicyAccepted) {
        togglePolicy();
      }
    },
    [isPolicyAccepted, togglePolicy]
  );

  const onTermsAccepted = useCallback(() => {
    setTermsAccepted(true);
    toggleTerms();
    setTermsErrorVisible(false);
  }, [toggleTerms]);
  const onPolicyAccepted = useCallback(() => {
    setPolicyAccepted(true);
    togglePolicy();
    setPolicyErrorVisible(false);
  }, [togglePolicy]);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isTermsAccepted) {
        setTermsErrorVisible(true);
        return;
      }
      if (!isPolicyAccepted) {
        setPolicyErrorVisible(true);
        return;
      }

      if (!nickname) {
        setNicknameErrorVisible(true);
        return;
      }
      try {
        const data: any = {
          nickname,
          terms_and_conditions_accepted: true,
          privacy_policy_accepted: true,
        };
        if (referralCode) {
          data.referral_code = referralCode;
        }
        const result = await agreeToTerms(data).unwrap();
        window.location.reload();
      } catch (e) {
        const errorKeys = Object.keys((e as any).data.data);
        if (errorKeys.includes("referral_code")) {
          setInvalidReferralCodeError(referralCode);
          return;
        }
        Sentry.captureException(e);
      }
    },
    [isPolicyAccepted, isTermsAccepted, nickname, referralCode]
  );

  const handleReferralCodeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setReferralCode(event.target.value);
    },
    []
  );

  const handleNicknameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setNickname(event.target.value);
    },
    []
  );

  return (
    <div className={styles.secondaryFormContainer}>
      <div className={styles.welcome}>
        Welcome to
        <br />
        <b>Wisdomise Wealth</b>
      </div>
      <form className={styles.secondaryForm} onSubmit={onSubmit}>
        <div className={styles.fieldWrapper}>
          <div className={styles.fieldLabel}>
            Invitation code <span>(Optional)</span>
          </div>
          <input
            type="text"
            value={referralCode}
            onChange={handleReferralCodeChange}
            className={styles.fieldInput}
            placeholder="Invitation code"
          />
          {hasInvalidReferralCodeError &&
            hasInvalidReferralCodeError === referralCode && (
              <div className={styles.fieldError}>
                Invitation code is not valid.
              </div>
            )}
        </div>
        <div className={styles.fieldWrapper}>
          <div className={styles.fieldLabel}>Nickname</div>
          <input
            type="text"
            onChange={handleNicknameChange}
            className={styles.fieldInput}
            placeholder="Nickname"
          />
          {nicknameErrorVisible && !nickname && (
            <div className={styles.fieldError}>
              This field can not be blank.
            </div>
          )}
        </div>
        <div className={styles.checkboxes}>
          <div className={styles.fieldWrapper}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isTermsAccepted}
                onChange={onTermsChecked}
                className={styles.checkbox}
              />
              You are agreeing to the{" "}
              <button className={styles.checkboxLink} onClick={toggleTerms}>
                terms and conditions
              </button>
            </label>
            {isTermsErrorVisible && !isTermsAccepted && (
              <div className={styles.fieldError}>Agree to continue.</div>
            )}
          </div>
          <div className={styles.fieldWrapper}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isPolicyAccepted}
                onChange={onPolicyChecked}
                className={styles.checkbox}
              />
              You are acknowledging the{" "}
              <button className={styles.checkboxLink} onClick={togglePolicy}>
                privacy policy
              </button>{" "}
              close.
            </label>
            {isPolicyErrorVisible && !isPolicyAccepted && (
              <div className={styles.fieldError}>Agree to continue.</div>
            )}
          </div>
        </div>
        <Button
          text={isLoading ? "Loading..." : "Submit"}
          disabled={isLoading}
          className={styles.submitBtn}
          type={BUTTON_TYPE.FILLED}
          onClick={onSubmit}
        />
      </form>
      <TermsDialog
        isOpen={isTermsOpen}
        toggle={toggleTerms}
        onCheck={onTermsAccepted}
      />
      <PolicyDialog
        isOpen={isPolicyOpen}
        toggle={togglePolicy}
        onCheck={onPolicyAccepted}
      />
    </div>
  );
}
