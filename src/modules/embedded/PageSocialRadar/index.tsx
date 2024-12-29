import { HotCoinsWidget } from 'modules/insight/coinRadar/PageCoinRadar/components/HotCoinsWidget';
import AuthGuard from 'modules/base/auth/AuthGuard';

export default function PageSocialRadar() {
  return (
    <AuthGuard>
      <HotCoinsWidget />
    </AuthGuard>
  );
}
