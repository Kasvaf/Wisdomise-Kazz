import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from 'api';
import { useModalLogin } from '../ModalLogin';
import { useIsLoggedIn } from '../jwt-store';
import { SubscriptionRequiredModal } from './SubscriptionRequiredModal';
import { TrialStartedModal } from './TrialStartedModal';
interface ProContext {
  ensureIsPro: () => Promise<boolean>;
  hasAccess: boolean;
}

const proContext = createContext<ProContext>({
  ensureIsPro: () => {
    throw new Error('Pro Context not initialized yet');
  },
  hasAccess: false,
});

export const usePro = () => useContext(proContext);

export function ProProvider({
  children,
}: PropsWithChildren<{
  className?: string;
}>) {
  const isLoggedIn = useIsLoggedIn();
  const [ModalLogin, showModalLogin] = useModalLogin();
  const navigate = useNavigate();
  const subscription = useSubscription();
  const [subscriptionModal, setSubscriptionModal] = useState(false);

  const value = useMemo<ProContext>(() => {
    return {
      ensureIsPro: () =>
        new Promise(resolve => {
          if (!isLoggedIn) {
            return showModalLogin();
          }
          if (subscription.type === 'free') {
            setSubscriptionModal(true);
            // never resolve
          } else {
            resolve(true);
          }
        }),
      hasAccess: isLoggedIn && subscription.type !== 'free',
    };
  }, [isLoggedIn, showModalLogin, subscription.type]);

  return (
    <proContext.Provider value={value}>
      {children}
      <TrialStartedModal />
      <SubscriptionRequiredModal
        open={subscriptionModal}
        onClose={() => setSubscriptionModal(false)}
        onConfirm={() => {
          setSubscriptionModal(false);
          navigate('/account/billing');
        }}
      />
      {ModalLogin}
    </proContext.Provider>
  );
}
