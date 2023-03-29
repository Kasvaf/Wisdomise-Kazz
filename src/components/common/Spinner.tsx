import { FunctionComponent } from "react";
import { ReactComponent as SpinnerIcon } from "@images/spinner.svg";
import { ReactComponent as SpinnerDarkIcon } from "@images/spinner-dark.svg";

interface SpinnerProps {
  dark?: boolean;
}

const Spinner: FunctionComponent<SpinnerProps> = ({ dark }) => (
  <div className="flex w-fit animate-spin self-center">
    {dark ? <SpinnerDarkIcon /> : <SpinnerIcon />}
  </div>
);
export default Spinner;
