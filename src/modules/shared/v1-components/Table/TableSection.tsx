import {
  type CSSProperties,
  useEffect,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from 'react';

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
  useEffect(() => {
    const el = element.current;
    if (!el || alwaysVisible) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.target === el) {
            setVisible(entry.isIntersecting);
          }
        }
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '150px',
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [alwaysVisible]);

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
