import { Link } from "react-router-dom";

import Logo from "@images/logo-full.svg";
import Target from "@images/target.svg";
import { gaClick } from "../../utils/ga";
import CongratsOverlay from "./components/CongratsOverlay";

function Congrats() {
  return (
    <div className="flex h-full min-h-full w-full items-start justify-center">
      <CongratsOverlay />
      <div className="flex h-full flex-col items-center justify-between">
        <div className="mt-8 block">
          <img src={Logo} alt="logo" />
        </div>
        <div className="flex w-full flex-col items-center space-y-10">
          <img className="w-32 xl:w-auto" src={Target} alt="Target" />
          <div className="text-4xl font-bold text-white">Congratulations!</div>
          <div className="px-8 text-center text-lg text-white opacity-50">
            <span>
              Thank you for registering. <br />
              We will collect a few details about you and you will be ready to
              join Horos.
            </span>
          </div>
          <Link className="flex w-full flex-row justify-center px-8" to="/quiz">
            <button
              type="button"
              className="horos-btn w-full xl:w-fit"
              onClick={() => gaClick("Congrats")}
            >
              Let ’ s Begin
            </button>
          </Link>
        </div>
        <div className="mb-8"> </div>
      </div>
    </div>
  );
}

export default Congrats;
