import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useSwipeNavigation } from 'utils/useSwipeNavigation';
import CoinChart from '../CoinChart';
import { useUnifiedCoinDetails } from '../lib';
import {
  MobilePageTabs,
  MobilePositionBar,
  MobileStatsBar,
  MobileTablesDrawer,
  MobileTokenHeader,
  MobileTradePanel,
  MobileTransactionsTable,
  TokenInfoDrawer,
} from './components';

type PageTab = 'trade' | 'transactions';

export default function CoinDetailsMobile() {
  const { symbol } = useUnifiedCoinDetails();
  const [activePageTab, setActivePageTab] = useState<PageTab>('trade');
  const [showTokenInfo, setShowTokenInfo] = useState(false);
  const [isTablesOpen, setIsTablesOpen] = useState(false);

  // Swipe navigation setup
  const { onDragEnd } = useSwipeNavigation<PageTab>({
    tabs: ['trade', 'transactions'],
    activeTab: activePageTab,
    onTabChange: setActivePageTab,
    swipeThreshold: 50,
    velocityThreshold: 500,
  });

  // Mock data for header display only (positions/PnL now use real hooks)
  const mockData = {
    token: {
      name: symbol.name || 'Unknown Token',
      ticker: symbol.abbreviation || 'N/A',
      age: '17h',
      viewers: 6,
      contractAddress: symbol.contractAddress || 'N/A',
      platform: 'pump',
      imageUrl: symbol.logo,
    },
  };

  return (
    <div className="flex h-full flex-col overflow-hidden overscroll-none bg-v1-background-primary">
      {/* Fixed Header Section */}
      <div className="shrink-0">
        {/* 1. Page Tabs */}
        <MobilePageTabs
          activeTab={activePageTab}
          onTabChange={setActivePageTab}
        />

        {/* 2. Token Header */}
        <MobileTokenHeader
          age={mockData.token.age}
          contractAddress={
            symbol.contractAddress || mockData.token.contractAddress
          }
          icon={symbol.logo || mockData.token.imageUrl}
          name={symbol.name || mockData.token.name}
          onInfoClick={() => setShowTokenInfo(true)}
          platform={mockData.token.platform as 'pump' | 'raydium'}
          ticker={symbol.abbreviation || mockData.token.ticker}
          viewers={mockData.token.viewers}
        />

        {/* 3. Stats Bar */}
        <MobileStatsBar />
      </div>

      {/* Main Content Area - Fills remaining space with Swipe */}
      <motion.div
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragDirectionLock
        dragElastic={0.2}
        dragListener={typeof window !== 'undefined' && window.innerWidth < 768}
        onDragEnd={onDragEnd}
      >
        {/* Swipeable Content Area */}
        <motion.div
          animate={{
            flex: isTablesOpen ? 0 : 1,
            opacity: isTablesOpen ? 0 : 1,
          }}
          className="min-h-0 overflow-hidden"
          transition={{
            flex: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.15 },
          }}
        >
          <div className="h-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="h-full"
                exit={{ opacity: 0, x: -20 }}
                initial={{ opacity: 0, x: 20 }}
                key={activePageTab}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {activePageTab === 'transactions' ? (
                  <MobileTransactionsTable />
                ) : (
                  <div className="h-full">
                    <CoinChart />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Tables Section (Slides up from above the fixed buy/sell section) */}
        <motion.div
          animate={{
            flex: isTablesOpen ? 1 : 0,
            opacity: isTablesOpen ? 1 : 0,
          }}
          className="overflow-hidden border-v1-border-tertiary border-t bg-v1-surface-l1"
          initial={false}
          transition={{
            flex: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.15 },
          }}
        >
          {isTablesOpen && (
            <div className="h-full">
              <MobileTablesDrawer />
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Fixed Bottom Section - Always Visible, Never Moves */}
      <div className="shrink-0">
        {/* Tables Toggle Button - Stuck to top of fixed section */}
        <div
          className="relative h-[56px] cursor-pointer border-v1-border-tertiary border-t bg-v1-surface-l1 transition-colors hover:bg-v1-surface-l2/50 active:bg-v1-surface-l2"
          onClick={() => setIsTablesOpen(!isTablesOpen)}
        >
          <div className="flex h-full flex-col items-center justify-center gap-2">
            {/* Drag Handle Pill */}
            <motion.div
              animate={{
                backgroundColor: isTablesOpen
                  ? '#606060'
                  : 'var(--color-v1-content-tertiary)',
              }}
              className="h-1 w-12 rounded-full bg-v1-content-tertiary"
              transition={{ duration: 0.2 }}
            />

            {/* Tables Label with Chevron */}
            <div className="flex items-center gap-2">
              <motion.svg
                animate={{
                  rotate: isTablesOpen ? 180 : 0,
                  y: isTablesOpen ? 0 : [-1, 1, -1],
                }}
                className="h-3.5 w-3.5 text-v1-content-brand"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                transition={{
                  rotate: { duration: 0.3, ease: 'easeOut' },
                  y: {
                    duration: 1.8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                  },
                }}
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 15l7-7 7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
              <span className="font-medium text-sm text-v1-content-primary">
                Tables
              </span>
              <motion.svg
                animate={{
                  rotate: isTablesOpen ? 180 : 0,
                }}
                className="h-3.5 w-3.5 text-v1-content-secondary"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                transition={{ duration: 0.3, ease: 'easeOut' }}
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 15l7-7 7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </div>
          </div>
        </div>

        {/* Position Bar - Fixed (Now using real hooks) */}
        <MobilePositionBar />

        {/* Trade Panel - Fixed (Now using real hooks) */}
        <MobileTradePanel />
      </div>

      {/* Token Info Drawer */}
      <TokenInfoDrawer
        isOpen={showTokenInfo}
        onClose={() => setShowTokenInfo(false)}
      />
    </div>
  );
}
