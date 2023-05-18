import Button from "components/Button";
import { FormEvent, useCallback, useState } from "react";
import { BUTTON_TYPE } from "utils/enums";
import PolicyDialog from "./PolicyDialog";
import styles from "./styles.module.scss";
import TermsDialog from "./TermsDialog";

export default function SecondaryForm() {
  const [isTermsOpen, setTermsOpen] = useState(false);
  const [isTermsAccepted, setTermsAccepted] = useState(false);
  const [isTermsErrorVisible, setTermsErrorVisible] = useState(false);
  const [isPolicyOpen, setPolicyOpen] = useState(false);
  const [isPolicyAccepted, setPolicyAccepted] = useState(false);
  const [isPolicyErrorVisible, setPolicyErrorVisible] = useState(false);

  const toggleTerms = useCallback(() => {
    setTermsOpen((p) => !p);
  }, []);
  const togglePolicy = useCallback(() => {
    setPolicyOpen((p) => !p);
  }, []);

  const onTermsChecked = useCallback(
    (event: any) => {
      if (!event.target.checked) return;

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
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isTermsAccepted) {
        setTermsErrorVisible(true);
        return;
      }
      if (!isPolicyAccepted) {
        setPolicyErrorVisible(true);
        return;
      }
    },
    [isPolicyAccepted, isTermsAccepted]
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
            className={styles.fieldInput}
            placeholder="Invitation code"
          />
        </div>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isTermsAccepted}
            onChange={onTermsChecked}
            className={styles.checkbox}
          />
          You are agreeing to the{" "}
          <button className={styles.checkboxLink}> terms and conditions</button>
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isPolicyAccepted}
            onChange={onPolicyChecked}
            className={styles.checkbox}
          />
          You are acknowledging the{" "}
          <button className={styles.checkboxLink}>privacy policy</button> close.
        </label>
        <Button
          text="Submit"
          className={styles.submitBtn}
          type={BUTTON_TYPE.FILLED}
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
