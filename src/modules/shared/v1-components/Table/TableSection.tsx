import { useEffect, useRef, useState, type FC } from 'react';

export const TableSection: FC<Omit<JSX.IntrinsicElements['tbody'], 'ref'>> = ({
  children,
  ...props
}) => {
  const element = useRef<HTMLTableSectionElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = element.current;
    if (!el) return;

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
        rootMargin: '300px',
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <tbody ref={element} {...props}>
      {visible ? children : null}
    </tbody>
  );
};
