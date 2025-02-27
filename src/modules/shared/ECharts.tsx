/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  init,
  type ECharts as EChartsType,
  type EChartsOption,
  type ECElementEvent,
} from 'echarts';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';

export const ECharts: FC<{
  className?: string;
  width?: number;
  height?: number;
  renderer?: 'canvas' | 'svg';
  options: EChartsOption;
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  onClick?: (e: ECElementEvent) => boolean | void;
}> = ({
  className,
  width,
  height,
  renderer,
  options: userOptions,
  onClick,
}) => {
  const element = useRef<HTMLDivElement>(null);
  const chart = useRef<EChartsType | undefined>(undefined);
  const [ready, setReady] = useState(false);

  const resize = useCallback(() => {
    if (!chart.current) return;
    chart.current?.resize({
      silent: true,
      height: height ?? 'auto',
      width: width ?? 'auto',
      animation: {
        duration: 0,
      },
    });
  }, [height, width]);

  // initialize
  useEffect(() => {
    if (!element.current || chart.current) return;

    chart.current = init(element.current, 'dark', {
      renderer,
      height: height ?? 'auto',
      width: width ?? 'auto',
    });
    chart.current.setOption({}, true);
    const tm = setTimeout(() => {
      resize();
      setReady(true);
    }, 100);
    return () => clearTimeout(tm);
  }, [height, renderer, resize, width]);

  // sync options
  useEffect(() => {
    if (!chart.current || !ready) return;
    const handleClick = onClick ?? (() => true);
    chart.current.on('click', handleClick);
    chart.current.setOption(
      {
        animationDuration: 1000,
        tooltip: {
          backgroundColor: '#282a32',
          textStyle: {
            color: '#ffffff',
          },
        },
        backgroundColor: 'transparent',
        ...userOptions,
      },
      true,
      true,
    );
    return () => {
      if (!chart.current) return;
      chart.current.off('click', handleClick);
    };
  }, [userOptions, onClick, ready]);

  useEventListener('resize', resize);

  return <div ref={element} className={className} />;
};
