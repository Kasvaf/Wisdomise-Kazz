import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';

type VisibilityMap = Map<Element, (visible: boolean) => void>;

const Context = createContext<{
  register: (el: Element, onChange: (v: boolean) => void) => void;
  unregister: (el: Element) => void;
} | null>(null);

export const IntersectionObserverProvider = ({
  children,
  rootMargin = '150px',
}: {
  children: ReactNode;
  rootMargin?: string;
}) => {
  const mapRef = useRef<VisibilityMap>(new Map());

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const callback = mapRef.current.get(entry.target);
          if (callback) callback(entry.isIntersecting);
        }
      },
      { root: null, threshold: 0, rootMargin },
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [rootMargin]);

  const register = (el: Element, callback: (v: boolean) => void) => {
    mapRef.current.set(el, callback);
    observerRef.current?.observe(el);
  };

  const unregister = (el: Element) => {
    mapRef.current.delete(el);
    observerRef.current?.unobserve(el);
  };

  return (
    <Context.Provider value={{ register, unregister }}>
      {children}
    </Context.Provider>
  );
};

export const useIntersectionObserver = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Must be used within <IntersectionObserverProvider>');
  }
  return context;
};
