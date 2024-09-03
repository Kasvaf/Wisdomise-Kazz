import { Tabs as AntTabs, type TabsProps } from 'antd';
import './style.css';
import { clsx } from 'clsx';

export default function Tabs({ className, ...props }: TabsProps) {
  // eslint-disable-next-line tailwindcss/no-custom-classname
  return <AntTabs {...props} className={clsx('wsdm-tabs', className)} />;
}
