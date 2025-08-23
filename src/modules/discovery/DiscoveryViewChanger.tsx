import { bxChevronLeft, bxChevronRight } from 'boxicons-quasar';
import clsx from 'clsx';
import {
  type CSSProperties,
  type FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';
import { useDiscoveryParams, useDiscoveryView } from './lib';

export const DiscoveryViewChanger: FC = () => {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const view = useDiscoveryView();

  if (!view)
    throw new Error('DiscoveryViewChanger only works on discovery routes');

  const [params, setParams] = useDiscoveryParams();

  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    const sidebarRect = document
      .querySelector('#sidebar')
      ?.getBoundingClientRect();
    const appListRect = document
      .querySelector('#app-list')
      ?.getBoundingClientRect();

    if (view === 'detail') {
      setStyle({
        top: (sidebarRect?.top ?? 74) + 12,
        left: (appListRect?.left ?? 68) + (appListRect?.width ?? 0) - 12,
      });
    } else {
      setStyle({
        top: (sidebarRect?.top ?? 74) + 12,
        right: 6,
      });
    }
  }, [view]);

  if (isMobile) return null;

  const handleExpandClick = () => {
    if (view !== 'detail') return;
    if (params.list) {
      setParams(
        {
          list: params.list,
        },
        'list',
      );
      return;
    } else {
      setParams(
        {
          list: 'trench',
        },
        'detail',
      );
      return;
    }
  };

  const handleCollapseClick = () => {
    if (view === 'detail') {
      setParams(
        {
          list: undefined,
        },
        'detail',
      );
    } else {
      setParams({}, 'detail');
    }
  };

  return (
    <div
      className={clsx('fixed z-30 flex flex-col items-center gap-1')}
      ref={ref}
      style={style}
    >
      {view === 'detail' && (
        <Button
          className="rounded-full"
          fab
          onClick={handleExpandClick}
          size="3xs"
          surface={1}
          variant="outline"
        >
          <Icon name={bxChevronRight} />
        </Button>
      )}
      {((view === 'detail' && params.list) ||
        (view === 'list' && params.detail)) && (
        <Button
          className="rounded-full"
          fab
          onClick={handleCollapseClick}
          size="3xs"
          surface={1}
          variant="outline"
        >
          <Icon name={bxChevronLeft} />
        </Button>
      )}
    </div>
  );
};
