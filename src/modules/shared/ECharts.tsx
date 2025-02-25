/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  type EChartsInitOpts,
  init,
  type ECharts as EChartsType,
  type EChartsOption,
  type ECElementEvent,
} from 'echarts';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';

export const ECharts: FC<{
  className?: string;
  options: EChartsOption;
  initOptions?: EChartsInitOpts;
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  onClick?: (e: ECElementEvent) => boolean | void;
}> = ({ className, initOptions, options: userOptions, onClick }) => {
  const element = useRef<HTMLDivElement>(null);
  const chart = useRef<EChartsType | undefined>(undefined);
  const [ready, setReady] = useState(false);

  const resize = useCallback(() => {
    if (!chart.current) return;
    chart.current?.resize({
      animation: {
        duration: 0,
      },
    });
  }, []);

  // initialize
  useEffect(() => {
    if (!element.current || chart.current) return;

    chart.current = init(element.current, 'dark', initOptions);
    chart.current.setOption(
      {
        animationDuration: 1000,
        tooltip: {
          backgroundColor: '#282a32',
          textStyle: {
            color: '#ffffff',
          },
        },
      },
      true,
    );
    const tm = setTimeout(() => {
      resize();
      setReady(true);
    }, 0);
    return () => clearTimeout(tm);
  }, [initOptions, resize]);

  // sync options
  useEffect(() => {
    if (!chart.current) return;
    const handleClick = onClick ?? (() => true);
    chart.current.on('click', handleClick);
    chart.current.setOption(
      {
        backgroundColor: 'transparent',
        ...(ready
          ? userOptions
          : {
              xAxis: {
                data: [],
              },
              yAxis: {
                data: [],
              },
            }),
      },
      false,
    );
    return () => {
      if (!chart.current) return;
      chart.current.off('click', handleClick);
    };
  }, [userOptions, onClick, ready]);

  useEventListener('resize', resize);

  return <div ref={element} className={className} />;
};
