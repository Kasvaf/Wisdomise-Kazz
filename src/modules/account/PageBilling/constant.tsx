import { type TabsProps } from 'antd';

export const AFTER_CHECKOUT_KEY = 'after_checkout';
export const SUCCESSFUL_CHECKOUT_KEY = 'successful_checkout';

export const SUBSCRIPTION_TABS: TabsProps['items'] = [
  {
    key: 'overview',
    label: 'Overview',
  },
  {
    key: 'invoices',
    label: 'Invoices',
  },
  {
    key: 'payment-methods',
    label: 'Payment Methods',
  },
];
