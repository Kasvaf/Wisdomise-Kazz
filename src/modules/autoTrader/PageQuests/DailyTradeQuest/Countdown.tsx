import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function Countdown({ deadline }: { deadline: number }) {
  const { t } = useTranslation('wisdomise-token');
  const countdownRef = useRef<HTMLDivElement>(null);
  // const daysFirstLetterRef = useRef<HTMLSpanElement>(null);
  // const daysSecondLetterRef = useRef<HTMLSpanElement>(null);
  const hoursFirstLetterRef = useRef<HTMLSpanElement>(null);
  const hoursSecondLetterRef = useRef<HTMLSpanElement>(null);
  const minutesFirstLetterRef = useRef<HTMLSpanElement>(null);
  const minutesSecondLetterRef = useRef<HTMLSpanElement>(null);
  const secondsFirstLetterRef = useRef<HTMLSpanElement>(null);
  const secondsSecondLetterRef = useRef<HTMLSpanElement>(null);

  const UNITS = [
    // {
    //   name: t('airdrop.countdown.days'),
    //   lettersRefs: [daysFirstLetterRef, daysSecondLetterRef],
    // },
    {
      name: t('airdrop.countdown.hours'),
      lettersRefs: [hoursFirstLetterRef, hoursSecondLetterRef],
    },
    {
      name: t('airdrop.countdown.minutes'),
      lettersRefs: [minutesFirstLetterRef, minutesSecondLetterRef],
    },
    {
      name: t('airdrop.countdown.seconds'),
      lettersRefs: [secondsFirstLetterRef, secondsSecondLetterRef],
    },
  ];

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    const initializeCountdown = () => {
      intervalId = setInterval(() => {
        if (
          // !daysFirstLetterRef.current ||
          // !daysSecondLetterRef.current ||
          !hoursFirstLetterRef.current ||
          !hoursSecondLetterRef.current ||
          !minutesFirstLetterRef.current ||
          !minutesSecondLetterRef.current ||
          !secondsFirstLetterRef.current ||
          !secondsSecondLetterRef.current
        )
          return;

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const now = Date.now();
        const distance = Math.max(deadline - now, 0);

        // const daysLetters = [
        //   ...String(Math.floor(distance / day)).padStart(2, '0'),
        // ];
        // daysFirstLetterRef.current.textContent = daysLetters[0];
        // daysSecondLetterRef.current.textContent = daysLetters[1];

        const hoursLetters = [
          ...String(Math.floor((distance % day) / hour)).padStart(2, '0'),
        ];
        hoursFirstLetterRef.current.textContent = hoursLetters[0];
        hoursSecondLetterRef.current.textContent = hoursLetters[1];

        const minutesLetters = [
          ...String(Math.floor((distance % hour) / minute)).padStart(2, '0'),
        ];
        minutesFirstLetterRef.current.textContent = minutesLetters[0];
        minutesSecondLetterRef.current.textContent = minutesLetters[1];

        const secondsLetters = [
          ...String(Math.floor((distance % minute) / second)).padStart(2, '0'),
        ];
        secondsFirstLetterRef.current.textContent = secondsLetters[0];
        secondsSecondLetterRef.current.textContent = secondsLetters[1];

        if (distance < 0) {
          clearInterval(intervalId);
        }
      }, 0);
    };
    initializeCountdown();

    return () => {
      clearInterval(intervalId);
    };
  }, [deadline]);

  return (
    <div className="max-md:w-full">
      <div className="text-center text-white" ref={countdownRef}>
        <ul className="flex gap-1">
          {UNITS.map((time, index) => {
            return (
              <>
                {index > 0 && ':'}
                <li key={time.name} className="flex flex-col items-center">
                  <h2 className="flex font-semibold">
                    {time.lettersRefs.map((letter, index) => {
                      return (
                        <div
                          key={index}
                          className="relative w-3 rounded text-center"
                        >
                          <span ref={letter}></span>
                        </div>
                      );
                    })}
                  </h2>
                </li>
              </>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
