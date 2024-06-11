import { useEffect, useState } from 'react';
import { createChart, type IChartApi } from 'lightweight-charts';

const useChartContainer = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [chart, setChart] = useState<IChartApi>();

  useEffect(() => {
    if (!container) return;
    const _chart = createChart(container, {
      height: 450,
      layout: {
        textColor: '#fff',
        background: { color: 'rgba(0,0,0,0.3)' },
      },
      grid: {
        horzLines: { color: '#333' },
        vertLines: { color: '#333' },
      },
    });
    setChart(_chart);

    const handleResize = () =>
      _chart.applyOptions({ width: container?.clientWidth });
    window.addEventListener('resize', handleResize);

    return () => {
      _chart.remove();
      window.removeEventListener('resize', handleResize);
    };
  }, [container]);

  return {
    chart,
    containerEl: (
      <div
        ref={el => setContainer(el)}
        className="overflow-hidden rounded-xl"
      />
    ),
  };
};

export default useChartContainer;
