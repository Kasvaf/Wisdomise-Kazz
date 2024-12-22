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
  theme?: string;
  options: EChartsOption;
  initOptions?: EChartsInitOpts;
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  onClick?: (e: ECElementEvent) => boolean | void;
}> = ({ className, initOptions, theme, options: userOptions, onClick }) => {
  const element = useRef<HTMLDivElement>(null);
  const chart = useRef<EChartsType | undefined>(undefined);

  // initialize
  useEffect(() => {
    if (!element.current) return;

    if (!chart.current) {
      chart.current = init(element.current, theme ?? 'dark', initOptions);
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
    }
    return () => {
      chart.current?.clear();
    };
  }, [theme, initOptions, userOptions]);

  // sync options
  useEffect(() => {
    if (!chart.current) return;
    if (onClick) chart.current.on('click', onClick);
    chart.current.setOption(userOptions, false);
    return () => {
      if (!chart.current) return;
      if (onClick) chart.current.off('click', onClick);
    };
  }, [userOptions, onClick]);

  // runtime effects
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

  return <div ref={element} className={className}></div>;
};
