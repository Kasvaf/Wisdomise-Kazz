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
  useEffect(() => {
    if (!element.current || chart.current) return;
    chart.current = init(element.current, theme ?? 'dark', initOptions);
    const options: EChartsOption = {
      tooltip: {
        backgroundColor: '#282a32',
        textStyle: {
          color: '#ffffff',
        },
      },
    };
    chart.current.setOption(options, true);
    chart.current.setOption(userOptions, false);
    if (onClick) chart.current.on('click', onClick);
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeout !== null) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(
        () =>
          chart.current?.resize({
            silent: true,
          }),
        100,
      );
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, initOptions, onClick, userOptions]);

  return <div ref={element} className={className}></div>;
};
