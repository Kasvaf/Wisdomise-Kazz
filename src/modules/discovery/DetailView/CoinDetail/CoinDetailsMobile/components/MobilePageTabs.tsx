import { ButtonSelect } from 'modules/shared/v1-components/ButtonSelect';

interface MobilePageTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function MobilePageTabs({
  activeTab = 'trade',
  onTabChange,
}: MobilePageTabsProps) {
  const tabs = [
    { value: 'trade', label: 'Trade' },
    { value: 'transactions', label: 'Transactions' },
  ];

  return (
    <div className="border-v1-border-tertiary border-b bg-v1-background-primary px-3 py-1.5">
      <ButtonSelect
        buttonClassName="flex-1"
        className="w-full"
        onChange={newTab => onTabChange?.(newTab)}
        options={tabs}
        size="sm"
        surface={1}
        value={activeTab}
      />
    </div>
  );
}
