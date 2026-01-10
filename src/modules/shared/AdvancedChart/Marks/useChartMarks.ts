import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAssetEventStream } from 'services/grpc/assetEvent';
import type { Swap } from 'services/grpc/proto/delphinus';
import { slugToTokenAddress } from 'services/rest/token-info';
import { useAdvancedChartWidget } from 'shared/AdvancedChart/ChartWidgetProvider';
import { useMarksClickListener } from 'shared/AdvancedChart/Marks/useMarksClickListener';
import { useMigrationMark } from 'shared/AdvancedChart/Marks/useMigrationMark';
import { useSwapsMarks } from 'shared/AdvancedChart/Marks/useSwapMarks';
import { useTweetMarks } from 'shared/AdvancedChart/Marks/useTweetMarks';
import type { Mark } from '../../../../../public/charting_library';

export const useChartMarks = ({
  deviceType,
}: {
  deviceType: 'mobile' | 'tablet' | 'desktop';
}) => {
  const { content } = useMarksClickListener();
  const [marks, setMarks] = useState<Mark[]>([]);
  const marksRef = useRef(marks);

  const [swaps, setSwaps] = useState<Swap[]>([]);
  const { setMigratedAt, mark: migrationMark } = useMigrationMark({
    deviceType,
  });
  const { marks: tweetMarks } = useTweetMarks({ deviceType });

  const { symbol } = useUnifiedCoinDetails();
  const [widget] = useAdvancedChartWidget();
  const [quote] = useActiveQuote();
  const { data: stream } = useAssetEventStream({
    payload: {
      asset: symbol.contractAddress!,
      network: 'solana',
      lastCandleOptions: {
        quote: slugToTokenAddress(quote),
        market: 'SPOT',
        convertToUsd: true,
      },
    },
    enabled: !!symbol.contractAddress,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    setSwaps([]);
  }, [symbol.contractAddress, quote, setSwaps]);

  const addSwap = useCallback((...newSwaps: Swap[]) => {
    setSwaps(prev => [...prev, ...newSwaps]);
  }, []);

  useEffect(() => {
    if (stream?.swap) addSwap(stream.swap);
  }, [stream, addSwap]);

  const swapMarks = useSwapsMarks({ swaps, deviceType });

  useEffect(() => {
    setMarks([
      ...swapMarks,
      ...(migrationMark ? [migrationMark] : []),
      ...tweetMarks,
    ]);
  }, [swapMarks, migrationMark, tweetMarks]);

  useEffect(() => {
    if (marks.length === 0) return;
    widget?.onChartReady(() => {
      try {
        widget.activeChart()?.refreshMarks();
      } catch {}
    });
  }, [widget, marks]);

  useEffect(() => {
    marksRef.current = marks;
  }, [marks]);

  return { marksRef, addSwap, setMigratedAt, content };
};
