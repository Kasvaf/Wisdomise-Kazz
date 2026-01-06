interface MobilePageTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function MobilePageTabs({
  activeTab = 'trade',
  onTabChange,
}: MobilePageTabsProps) {
  const tabs = [
    { id: 'trade', label: 'Trade' },
    { id: 'transactions', label: 'Transactions' },
  ];

  return (
    <div className="border-v1-border-tertiary border-b bg-v1-background-primary px-3 py-1.5">
      <div className="flex w-full items-center gap-1 rounded-lg bg-v1-surface-l1 p-1">
        {tabs.map(tab => (
          <button
            className={`flex-1 rounded-md px-3 py-1.5 font-medium text-xs transition-all ${
              activeTab === tab.id
                ? 'bg-v1-surface-l2 text-white shadow-sm'
                : 'text-neutral-600 hover:text-white'
            }`}
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
