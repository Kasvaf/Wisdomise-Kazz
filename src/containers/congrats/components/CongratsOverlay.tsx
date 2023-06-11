import Confetti1 from "@images/quiz/confetti.svg";
import Confetti2 from "@images/quiz/confetti2.svg";
import Confetti3 from "@images/quiz/confetti3.svg";
import Confetti4 from "@images/quiz/confetti4.svg";
import Confetti5 from "@images/quiz/confetti5.svg";
import Ribbon1 from "@images/quiz/ribbon1.svg";
import Ribbon2 from "@images/quiz/ribbon2.svg";
import Ribbon3 from "@images/quiz/ribbon3.svg";

function CongratsOverlay() {
  return (
    <div className="absolute left-0 top-0 -z-10 h-full w-full">
      <img
        src={Ribbon1}
        className="animate-wobble absolute -top-2 left-[75%] w-16 animation-delay-150 xl:w-auto"
        alt="ribbon1"
      />
      <img
        src={Ribbon2}
        className="animate-wobble absolute -top-2 left-[60%] w-16 animation-delay-300 xl:w-auto"
        alt="ribbon2"
      />
      <img
        src={Ribbon3}
        className="animate-wobble absolute -top-2 left-[10%] w-16 xl:w-auto"
        alt="ribbon3"
      />
      <img
        src={Confetti1}
        className="animate-roll-in absolute left-[30%] top-[30%] w-6 xl:w-auto"
        alt="confetti1"
      />
      <img
        src={Confetti2}
        className="animate-roll-in absolute left-[31%] top-[70%] w-6 animation-delay-100 xl:w-auto"
        alt="confetti2"
      />
      <img
        src={Confetti3}
        className="animate-roll-in absolute left-[75%] top-[40%] w-6 animation-delay-200 xl:w-auto"
        alt="confetti3"
      />
      <img
        src={Confetti4}
        className="animate-roll-in absolute left-[25%] top-[50%] w-6 animation-delay-300 xl:w-auto"
        alt="confetti4"
      />
      <img
        src={Confetti5}
        className="animate-roll-in absolute left-[70%] top-[75%] w-6 animation-delay-400 xl:w-auto"
        alt="confetti5"
      />
    </div>
  );
}

export default CongratsOverlay;
