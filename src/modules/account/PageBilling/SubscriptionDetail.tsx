import { Tabs } from 'antd';
import { useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SUBSCRIPTION_TABS } from 'modules/account/PageBilling/constant';

export default function SubscriptionDetail() {
  const navigate = useNavigate();
  const handleTabChange = useCallback((key: string) => {
    navigate(key);
  }, []);

  return (
    <>
      <h1 className="mb-4 text-base font-semibold text-white">
        Subscription details
      </h1>
      <Tabs
        items={SUBSCRIPTION_TABS}
        tabBarStyle={{ color: '#fff' }}
        defaultActiveKey={window.location.pathname.split('/').at(-1)}
        onChange={handleTabChange}
      />
      <Outlet />
    </>
  );
}
