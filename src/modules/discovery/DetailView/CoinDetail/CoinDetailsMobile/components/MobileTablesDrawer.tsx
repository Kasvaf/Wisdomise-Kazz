import { Button } from 'modules/shared/v1-components/Button';
import { useState } from 'react';
import { MobileBubbleChartTab } from './tabs/MobileBubbleChartTab';
import { MobileDevTokensTab } from './tabs/MobileDevTokensTab';
import { MobileOrdersTab } from './tabs/MobileOrdersTab';
import { MobilePositionsTab } from './tabs/MobilePositionsTab';
import { MobileTopHoldersTab } from './tabs/MobileTopHoldersTab';

type TabType =
  | 'positions'
  | 'top-holders'
  | 'bubble-chart'
  | 'orders'
  | 'dev-tokens';

export function MobileTablesDrawer({
  walletAddress,
}: {
  walletAddress?: string;
}) {
  const [activeTab, setActiveTab] = useState<TabType>('top-holders');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'positions', label: 'Positions' },
    { id: 'top-holders', label: 'Top Holders' },
    { id: 'orders', label: 'Orders' },
    { id: 'dev-tokens', label: 'Dev Tokens' },
    { id: 'bubble-chart', label: 'Bubble chart' },
  ];

  return (
    <div className="flex h-full flex-col bg-v1-background-primary">
      {/* Sub-tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-v1-border-tertiary border-b px-3 py-2">
        {tabs.map(tab => (
          <Button
            className={activeTab === tab.id ? 'text-white' : 'text-neutral-600'}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            size="sm"
            surface={activeTab === tab.id ? 2 : 0}
            variant="ghost"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Positions Tab */}
      {activeTab === 'positions' && <MobilePositionsTab />}

      {/* Top Holders Tab */}
      {activeTab === 'top-holders' && <MobileTopHoldersTab />}

      {/* Bubble Chart Tab */}
      {activeTab === 'bubble-chart' && <MobileBubbleChartTab />}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <MobileOrdersTab walletAddress={walletAddress} />
      )}

      {/* Dev Tokens Tab */}
      {activeTab === 'dev-tokens' && <MobileDevTokensTab />}
    </div>
  );
}
