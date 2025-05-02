import {
  createContext,
  type ReactNode,
  useEffect,
  useRef,
  type FC,
  useMemo,
  useContext,
} from 'react';

interface Position {
  top: number;
  left: number;
}

type Rect = Position & {
  width: number;
  height: number;
};

interface ComponentsProvicerContext {
  getPointerPosition: () => Position;
  getLastClickRect: (selector?: string) => Rect | null;
}

const context = createContext<ComponentsProvicerContext | null>(null);

export const useComponentsContext = () => useContext(context);

export const ComponentsProvider: FC<{
  children?: ReactNode;
}> = ({ children }) => {
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
    const handlePointerMove = (event: MouseEvent) => {
      pointerPosition.current = {
        left: event.clientX,
        top: event.clientY,
      };
    };

    document.addEventListener('mousedown', handlePointerDown, true);
    document.addEventListener('mousemove', handlePointerMove);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown, true);
      document.removeEventListener('mousemove', handlePointerMove);
    };
  }, []);

  const provide = useMemo<ComponentsProvicerContext>(
    () => ({
      getPointerPosition: () => pointerPosition.current,
      getLastClickRect: selector => {
        let anchor = lastClick.current;
        if (selector) {
          while (anchor) {
            if (anchor.matches?.(selector)) break;
            anchor = anchor.parentElement;
          }
        }
        return anchor?.getBoundingClientRect() ?? null;
      },
    }),
    [],
  );

  return <context.Provider value={provide}>{children}</context.Provider>;
};
