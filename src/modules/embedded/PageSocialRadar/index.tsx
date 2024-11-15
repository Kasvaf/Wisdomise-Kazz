import { HotCoinsWidget } from 'modules/insight/coinRadar/PageCoinRadar/components/HotCoinsWidget';
import AuthGuard from 'modules/base/auth/AuthGuard';
import { ProProvider } from 'modules/base/auth/ProContent/ProProvider';

export default function PageSocialRadar() {
  return (
    <AuthGuard>
      <ProProvider>
        <HotCoinsWidget />
      </ProProvider>
    </AuthGuard>
  );
}
