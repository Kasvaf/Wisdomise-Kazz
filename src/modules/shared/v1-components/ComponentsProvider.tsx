import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { debounce } from 'utils/throttle';

interface Position {
  top: number;
  left: number;
}

export interface ComponentsProvicerContext {
  getPointerPosition: () => Position;
  getLastClickElement: (selector?: string) => HTMLElement | null;
  addOverlay: (element: HTMLElement) => void;
  removeOverlay: (element: HTMLElement) => void;
  getLastOverlay: () => HTMLElement;
}

const context = createContext<ComponentsProvicerContext | null>(null);

export const useComponentsContext = () => {
  const value = useContext(context);
  if (!value) throw new Error('ComponentsProvider is missing');
  return value;
};

export const ComponentsProvider: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const overlays = useRef<HTMLElement[]>([document.body]);
  const lastClick = useRef<HTMLElement | null>(null);
  const pointerPosition = useRef<Position>({
    top: window.innerHeight / 2,
    left: window.innerWidth / 2,
  });

  useEffect(() => {
    const handlePointerDown = (event: Event) => {
      if (event.target) {
        lastClick.current = event.target as HTMLElement | null;
      }
    };
    const { run: handlePointerMove, clear: clearDebounce } = debounce(
      (event: MouseEvent) => {
        pointerPosition.current = {
          left: event.clientX,
          top: event.clientY,
        };
      },
      1,
    );

    document.addEventListener('mousedown', handlePointerDown, true);
    document.addEventListener('mousemove', handlePointerMove);
    return () => {
      clearDebounce();
      document.removeEventListener('mousedown', handlePointerDown, true);
      document.removeEventListener('mousemove', handlePointerMove);
    };
  }, []);

  const provide = useMemo<ComponentsProvicerContext>(
    () => ({
      getPointerPosition: () => pointerPosition.current,
      getLastClickElement: selector => {
        let anchor = lastClick.current;
        if (selector) {
          while (anchor) {
            if (anchor.matches?.(selector)) break;
            anchor = anchor.parentElement;
          }
        }
        return anchor ?? null;
      },
      addOverlay: element => {
        if (!overlays.current.includes(element) && element !== document.body) {
          overlays.current = [...overlays.current, element];
        }
      },
      removeOverlay: element => {
        if (element !== document.body) {
          overlays.current = overlays.current.filter(x => x !== element);
        }
      },
      getLastOverlay: () => overlays.current[overlays.current.length - 1],
    }),
    [],
  );

  return <context.Provider value={provide}>{children}</context.Provider>;
};
