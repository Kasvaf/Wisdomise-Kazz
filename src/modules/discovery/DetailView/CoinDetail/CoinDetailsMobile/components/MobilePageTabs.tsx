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
    <div className="border-[#252525] border-b bg-[#0e0e0e] px-3 py-1.5">
      <div className="flex w-full items-center gap-1 rounded-lg bg-[#1f1f1f] p-1">
        {tabs.map(tab => (
          <button
            className={`flex-1 rounded-md px-3 py-1.5 font-medium text-xs transition-all ${
              activeTab === tab.id
                ? 'bg-[#252525] text-white shadow-sm'
                : 'text-[#606060] hover:text-white'
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
