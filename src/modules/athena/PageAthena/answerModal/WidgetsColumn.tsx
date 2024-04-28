import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import useIsMobile from 'utils/useIsMobile';
import { type AthenaWidget, useAthena } from 'modules/athena/core';
import chartIcon from '../images/chart.svg';
import newsIcon from '../images/news.svg';
import nftIcon from '../images/nft.svg';
import DeFiSrc from '../images/passive-income-defi.svg';
import signalsIcon from '../images/signals.svg';
import spoIcon from '../images/spo.svg';
import topCoinsIcon from '../images/topCoins.svg';
import tweetsIcon from '../images/tweets.svg';
import { WidgetDetector } from './WidgetDetector';

export const WidgetsColumn = () => {
  const isMobile = useIsMobile();
  const widgetWrapper = useRef<HTMLElement>(null);
  const [_currentWidget, setCurrentWidget] = useState<AthenaWidget['type']>();
  const currentWidget = useDebounce(_currentWidget, 200);
  const { widgets, question, isAnswerFinished } = useAthena();

  const onWidgetIconClick = (type: AthenaWidget['type']) => {
    if (isMobile) {
      setCurrentWidget(type);
      const i = widgets.findIndex(w => w.type === type);
      widgetWrapper.current?.scrollTo({
        behavior: 'smooth',
        left: i * (document.documentElement.clientWidth - 16),
      });
    } else {
      document
        .querySelector(`#${type}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    setCurrentWidget(widgets[0]?.type);
  }, [widgets]);

  useEffect(() => {
    let observers: IntersectionObserver[] = [];
    setTimeout(() => {
      observers = widgets.map(w => {
        const ob = new IntersectionObserver(
          entries => {
            if (entries[0].isIntersecting) {
              setCurrentWidget(w.type);
            }
          },
          { threshold: 0.8 },
        );
        const el = document.querySelector(`#${w.type}`);
        el && ob.observe(el);
        return ob;
      });
    }, 2000);

    return () => {
      for (const o of observers) o.disconnect();
    };
  }, [widgets, isMobile]);

  if (widgets.length === 0) return null;

  return !question ||
    (question && isMobile && isAnswerFinished) ||
    (question && !isMobile) ? (
    <div
      className={clsx(
        'max-xl:px-0 relative flex overflow-hidden pl-6 pr-8 mobile:mt-4 mobile:flex-col mobile:gap-4 mobile:overflow-visible mobile:px-0',
        'ml-auto w-fit mobile:w-full',
      )}
    >
      <section
        ref={widgetWrapper}
        className={clsx(
          'no-scrollbar flex w-3/4 grow flex-col items-stretch gap-8 overflow-y-auto pr-8',
          'mobile:order-2 mobile:w-[unset] mobile:snap-x mobile:flex-row mobile:overflow-x-auto mobile:overflow-y-hidden mobile:pr-0',
        )}
      >
        {widgets.map((data, i) => (
          <section
            key={i}
            id={data.type}
            className="mobile:max-h-[563px] mobile:min-w-[calc(100vw-3rem)]"
          >
            <WidgetDetector data={data} />
          </section>
        ))}
      </section>

      <section
        className={clsx(
          'flex flex-col gap-3 self-center text-white ',
          'mobile:no-scrollbar mobile:order-1 mobile:w-full mobile:flex-row mobile:gap-2 mobile:overflow-x-auto',
        )}
      >
        {widgets.map(w => (
          <button
            key={w.type}
            onClick={() => onWidgetIconClick(w.type)}
            className={clsx(
              'flex w-[60px] cursor-pointer flex-col items-center justify-center gap-2 py-3 text-xs transition-all mobile:shrink-0 mobile:grow-0 mobile:basis-[60px]',
              w.type === currentWidget && 'rounded-lg bg-white/30 ',
            )}
          >
            <img
              src={widgetsInfo[w.type].icon}
              alt="icon"
              className="h-4 w-4"
            />
            <span className="text-xs font-medium">
              {widgetsInfo[w.type].name}
            </span>
          </button>
        ))}
      </section>
    </div>
  ) : null;
};

const widgetsInfo = {
  news: { name: 'News', icon: newsIcon },
  price_chart: { name: 'Chart', icon: chartIcon },
  no_specific_widget: { name: '', icon: newsIcon }, // just for typing. will not used
  top_trending_nfts: { name: 'NFT Rank', icon: nftIcon },
  smart_crypto_portfolio: { name: 'SPO', icon: spoIcon },
  last_positions: { name: 'Signals', icon: signalsIcon },
  top_trending_alt_coins: { name: 'Crypto Rank', icon: topCoinsIcon },
  top_trending_tweets: { name: 'Tweets', icon: tweetsIcon },
  passive_income_defi: { name: 'DeFi', icon: DeFiSrc },
};
