/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  type EChartsInitOpts,
  init,
  type ECharts as EChartsType,
  type EChartsOption,
  type ECElementEvent,
} from 'echarts';
import { type FC, useEffect, useRef } from 'react';

export const ECharts: FC<{
  className?: string;
  options: EChartsOption;
  initOptions?: EChartsInitOpts;
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  onClick?: (e: ECElementEvent) => boolean | void;
}> = ({ className, initOptions, options: userOptions, onClick }) => {
  const element = useRef<HTMLDivElement>(null);
  const chart = useRef<EChartsType | undefined>(undefined);

  // initialize
  useEffect(() => {
    if (!element.current || chart.current) return;

    chart.current = init(element.current, 'dark', initOptions);
    chart.current.setOption(
      {
        tooltip: {
          backgroundColor: '#282a32',
          textStyle: {
            color: '#ffffff',
          },
        },
      },
      true,
    );
  }, [initOptions]);

  // sync options
  useEffect(() => {
    if (!chart.current) return;
    const handleClick = onClick ?? (() => true);
    chart.current.on('click', handleClick);
    chart.current.setOption(userOptions, false);
    return () => {
      if (!chart.current) return;
      chart.current.off('click', handleClick);
    };
  }, [userOptions, onClick]);

  // dynamic resize
  useEffect(() => {
    if (!chart.current) return;
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeout !== null) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        chart.current?.resize({
          silent: true,
          animation: {
            delay: 0,
          },
        });
      }, 0);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return <div ref={element} className={className} />;
};
