import { useEffect, useRef, useState } from 'react';
import { useAdvancedChartWidget } from 'shared/AdvancedChart/ChartWidgetProvider';

export const useSelectedCandle = () => {
  const [widget] = useAdvancedChartWidget();
  const crossHairTime = useRef<number>(0);
  const [startTime, setStartTime] = useState<number>();
  const [endTime, setEndTime] = useState<number>();
  const enabled = useRef<boolean>(false);

  const objectsRef = useRef<any[]>([]);

  const setEnabled = (value: boolean) => {
    enabled.current = value;
  };

  function cleanLines() {
    for (const obj of objectsRef.current) {
      try {
        widget?.activeChart().removeEntity(obj);
      } catch {}
    }
    objectsRef.current = [];
    setStartTime(undefined);
    setEndTime(undefined);
  }

  // this is very necessary to prevent read-calls (race-condition) after use-effect destructed
  let destructed = false;
  function getChartCleaned() {
    try {
      cleanLines();
      return !destructed && widget?.activeChart();
    } catch {}
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (!enabled.current) return;

    widget?.onChartReady(() => {
      widget
        ?.activeChart()
        .crossHairMoved()
        .subscribe(null, ({ time }) => {
          crossHairTime.current = time;
        });
      widget?.subscribe('mouse_up', _params => {
        if (!enabled.current) return;
        const res = widget.activeChart().resolution();
        const period = res.endsWith('S') ? +res.split('')[0] : +res * 60;

        getChartCleaned();

        setStartTime(crossHairTime.current);
        setEndTime(crossHairTime.current + period);

        const l = widget.activeChart().createShape(
          { time: crossHairTime.current },
          {
            shape: 'vertical_line',
            overrides: {
              linecolor: 'rgba(190,255,33,0.59)',
              showTime: false,
            },
            disableSelection: true,
            disableSave: true,
            lock: true,
          },
        );
        objectsRef.current.push(l);
      });
    });

    return () => {
      destructed = true;
      cleanLines();
    };
  }, [widget, enabled.current]);

  return {
    enabled: enabled.current,
    setEnabled,
    startTime,
    endTime,
    cleanLines,
  };
};
