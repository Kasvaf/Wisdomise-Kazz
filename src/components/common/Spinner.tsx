import { ReactComponent as SpinnerDarkIcon } from "@images/spinner-dark.svg";
import { ReactComponent as SpinnerIcon } from "@images/spinner.svg";
import { FunctionComponent } from "react";

interface SpinnerProps {
  dark?: boolean;
}

const Spinner: FunctionComponent<SpinnerProps> = ({ dark }) => (
  <div className="flex w-fit animate-spin self-center">{dark ? <SpinnerDarkIcon /> : <SpinnerIcon />}</div>
);
export default Spinner;
