import {
  type CSSProperties,
  useEffect,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from 'react';
import { useIntersectionObserver } from './IntersectionProvider';

export const TableSection: FC<
  Omit<JSX.IntrinsicElements['tbody'], 'ref'> & {
    optimisticStyle?: CSSProperties;
    fallbackChildren?: ReactNode;
    alwaysVisible?: boolean;
  }
> = ({
  children,
  style,
  optimisticStyle,
  fallbackChildren,
  alwaysVisible,
  ...props
}) => {
  const element = useRef<HTMLTableSectionElement>(null);
  const [visible, setVisible] = useState(false);
  const { register, unregister } = useIntersectionObserver();

  useEffect(() => {
    const el = element.current;
    if (!el || alwaysVisible) return;

    register(el, setVisible);
    return () => unregister(el);
  }, [alwaysVisible, register, unregister]);

  return (
    <tbody
      ref={element}
      style={{
        ...style,
        ...(!visible && !alwaysVisible && optimisticStyle),
      }}
      {...props}
    >
      {visible || alwaysVisible ? children : fallbackChildren ?? null}
    </tbody>
  );
};
