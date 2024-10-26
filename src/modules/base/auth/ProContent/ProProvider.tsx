import {
  createContext,
  type DOMAttributes,
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
  handleClick: DOMAttributes<HTMLElement>['onClick'];
  hasAccess: boolean;
}

const proContext = createContext<ProContext>({
  handleClick: () => {
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
      handleClick: async e => {
        if (isLoggedIn && subscription.levelType !== 'free') return;
        if (e) {
          e?.preventDefault();
          e?.stopPropagation();
        }
        if (isLoggedIn) {
          setSubscriptionModal(true);
        } else {
          void showModalLogin();
        }
      },
      hasAccess: isLoggedIn && subscription.levelType !== 'free',
    };
  }, [isLoggedIn, showModalLogin, subscription.levelType]);

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
