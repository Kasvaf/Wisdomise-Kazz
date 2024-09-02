import { Tabs as AntTabs, type TabsProps } from 'antd';
import './style.css';

export default function Tabs(props: TabsProps) {
  return <AntTabs {...props} />;
}
