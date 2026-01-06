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

  // Mock data - will be replaced with real data later
  const mockData = {
    token: {
      name: symbol.name || 'Unknown Token',
      ticker: symbol.ticker || 'N/A',
      age: '17h',
      viewers: 6,
      contractAddress: symbol.address || 'N/A',
      platform: 'pump',
      imageUrl: symbol.imageUrl,
    },
    stats: {
      marketCap: 1_170_000,
      volume: 868.2,
      liquidity: 131_000,
      holders: 3950,
      fees: 124.3,
    },
    position: {
      bought: 0,
      sold: 0,
      holding: 0,
      holdingTokens: 0,
      pnl: 0,
      pnlPercent: 0,
    },
    security: {
      top10HolderPercent: 12.5,
      devHoldingPercent: 0,
      lpBurned: true,
      mintAuthority: false,
      freezeAuthority: false,
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
          contractAddress={mockData.token.contractAddress}
          imageUrl={mockData.token.imageUrl}
          name={mockData.token.name}
          onInfoClick={() => setShowTokenInfo(true)}
          platform={mockData.token.platform as 'pump' | 'raydium'}
          ticker={mockData.token.ticker}
          viewers={mockData.token.viewers}
        />

        {/* 3. Stats Bar */}
        <MobileStatsBar
          fees={mockData.stats.fees}
          holders={mockData.stats.holders}
          liquidity={mockData.stats.liquidity}
          marketCap={mockData.stats.marketCap}
          volume={mockData.stats.volume}
        />
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
        <div className="min-h-0 flex-1 overflow-hidden">
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

      {/* Fixed Bottom Section - Trade Controls & Tables (Always Visible) */}
      <div className="shrink-0">
        {/* Position Bar */}
        <MobilePositionBar
          bought={mockData.position.bought}
          holding={mockData.position.holding}
          holdingTokens={mockData.position.holdingTokens}
          pnl={mockData.position.pnl}
          pnlPercent={mockData.position.pnlPercent}
          sold={mockData.position.sold}
          tokenSymbol={mockData.token.ticker}
        />

        {/* Trade Panel */}
        <MobileTradePanel
          activePageTab={activePageTab}
          balance={0}
          positions={1}
          tokenAmount={0}
        />

        {/* Tables Section (Modern Bottom Sheet) */}
        <motion.div
          animate={{
            height: isTablesOpen ? 300 : 56,
          }}
          className="overflow-hidden border-v1-border-tertiary border-t bg-v1-surface-l1"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          initial={false}
          onDragEnd={(_, info) => {
            if (info.offset.y > 50) {
              setIsTablesOpen(false);
            } else if (info.offset.y < -50) {
              setIsTablesOpen(true);
            }
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 35,
          }}
        >
          {/* Minimalist Bottom Sheet Handle */}
          <div
            className="relative h-[56px] cursor-pointer transition-colors hover:bg-v1-surface-l2/50 active:bg-v1-surface-l2"
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

          {/* Content */}
          {isTablesOpen && (
            <div className="h-[244px] border-v1-border-tertiary border-t">
              <MobileTablesDrawer />
            </div>
          )}
        </motion.div>
      </div>

      {/* Token Info Drawer */}
      <TokenInfoDrawer
        isOpen={showTokenInfo}
        onClose={() => setShowTokenInfo(false)}
      />
    </div>
  );
}
