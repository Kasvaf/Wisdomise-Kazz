import { useEffect, useRef } from 'react';

export default function Countdown() {
  const countdownRef = useRef<HTMLDivElement>(null);
  const daysFirstLetterRef = useRef<HTMLSpanElement>(null);
  const daysSecondLetterRef = useRef<HTMLSpanElement>(null);
  const hoursFirstLetterRef = useRef<HTMLSpanElement>(null);
  const hoursSecondLetterRef = useRef<HTMLSpanElement>(null);
  const minutesFirstLetterRef = useRef<HTMLSpanElement>(null);
  const minutesSecondLetterRef = useRef<HTMLSpanElement>(null);
  const secondsFirstLetterRef = useRef<HTMLSpanElement>(null);
  const secondsSecondLetterRef = useRef<HTMLSpanElement>(null);

  const UNITS = [
    { name: 'days', lettersRefs: [daysFirstLetterRef, daysSecondLetterRef] },
    { name: 'hours', lettersRefs: [hoursFirstLetterRef, hoursSecondLetterRef] },
    {
      name: 'minutes',
      lettersRefs: [minutesFirstLetterRef, minutesSecondLetterRef],
    },
    {
      name: 'seconds',
      lettersRefs: [secondsFirstLetterRef, secondsSecondLetterRef],
    },
  ];

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    const initializeCountdown = () => {
      const deadline = new Date('2024-06-07T08:00:00').getTime();
      intervalId = setInterval(() => {
        if (
          !daysFirstLetterRef.current ||
          !daysSecondLetterRef.current ||
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

        const daysLetters = [
          ...String(Math.floor(distance / day)).padStart(2, '0'),
        ];
        daysFirstLetterRef.current.textContent = daysLetters[0];
        daysSecondLetterRef.current.textContent = daysLetters[1];

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
  }, []);

  return (
    <div className="max-md:w-full">
      <p className="mb-3">Remaining time to claim</p>
      <div id="countdown" className="text-center text-white" ref={countdownRef}>
        <ul className="grid grid-cols-4 gap-6">
          {UNITS.map(time => {
            return (
              <li
                key={time.name}
                className="col-span-2 flex flex-col items-center lg:col-span-1"
              >
                <h2 className="flex gap-1 text-4xl font-semibold">
                  {time.lettersRefs.map((letter, index) => {
                    return (
                      <div
                        key={index}
                        className="relative w-12 rounded bg-white/10 py-3 text-center"
                      >
                        <TimerSplitter />
                        <span ref={letter}></span>
                      </div>
                    );
                  })}
                </h2>
                <p className="mt-6">{time.name}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function TimerSplitter() {
  return (
    <div className="absolute top-1/2 flex w-full -translate-y-1/2 items-center">
      <div className="h-2 w-1 bg-white/40"></div>
      <div className="h-px grow bg-black/80"></div>
      <div className="h-2 w-1 bg-white/40"></div>
    </div>
  );
}
